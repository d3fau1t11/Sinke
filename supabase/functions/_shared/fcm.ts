type FirebaseAccount = { project_id: string; client_email: string; private_key: string };
let cached: { token: string; expiresAt: number } | undefined;

function base64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}
const encode = (value: unknown) => base64Url(new TextEncoder().encode(JSON.stringify(value)));

function account(): FirebaseAccount {
  const value = Deno.env.get('FCM_SERVICE_ACCOUNT_JSON');
  if (!value) throw new Error('Firebase service account is not configured');
  const parsed = JSON.parse(value) as FirebaseAccount;
  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
    throw new Error('Invalid Firebase service account');
  }
  return parsed;
}

async function accessToken(serviceAccount: FirebaseAccount) {
  if (cached && cached.expiresAt > Date.now() + 60000) return cached.token;
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;
  const pem = serviceAccount.private_key.replace(/-----[^-]+-----|\s/g, '');
  const bytes = Uint8Array.from(atob(pem), (value) => value.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8',
    bytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsigned),
  );
  const assertion = `${unsigned}.${base64Url(new Uint8Array(signature))}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!response.ok) throw new Error('Firebase authentication failed');
  const result = (await response.json()) as { access_token: string; expires_in: number };
  cached = { token: result.access_token, expiresAt: Date.now() + result.expires_in * 1000 };
  return cached.token;
}

export async function sendFirebaseNotification(
  token: string,
  title: string,
  body: string,
  data: Record<string, string> = {},
) {
  const serviceAccount = account();
  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${encodeURIComponent(serviceAccount.project_id)}/messages:send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await accessToken(serviceAccount)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          data,
          android: { priority: 'high', notification: { channel_id: 'senik_orders' } },
        },
      }),
    },
  );
  if (!response.ok) throw new Error(`Firebase delivery failed (${response.status})`);
}
