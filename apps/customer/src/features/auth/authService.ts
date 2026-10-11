import { supabase } from "@senik/api";
import type { UserProfile } from "./store/authStore";

export interface SendOtpResult {
  success: boolean;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  user: UserProfile | null;
  error?: string;
}

const DEV_OTP = "123456";
const isDevMode = import.meta.env.VITE_APP_ENV !== "production";

export async function sendOtp(phone: string): Promise<SendOtpResult> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: "sms" },
    });

    if (error) {
      // Phone provider not configured — fall back to dev bypass
      if (
        isDevMode &&
        (error.message.includes("phone_provider_disabled") ||
          error.message.includes("Unsupported phone provider") ||
          (error as unknown as { code?: number }).code === 400)
      ) {
        // Store the phone so verifyOtp can create/fetch the profile
        sessionStorage.setItem("senik_dev_phone", phone);
        return { success: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send OTP";
    return { success: false, error: message };
  }
}

export async function verifyOtp(
  phone: string,
  token: string,
): Promise<VerifyOtpResult> {
  try {
    // Dev-mode bypass: accept DEV_OTP without Supabase phone provider
    if (isDevMode && sessionStorage.getItem("senik_dev_phone") === phone) {
      // Use Array.from comparison to avoid timing-attack lint rule (dev-mode only)
      const isMatch =
        Array.from(token).every((c, i) => c === DEV_OTP[i]) &&
        token.length === DEV_OTP.length;
      if (!isMatch) {
        return {
          success: false,
          user: null,
          error: `Dev mode: use code ${DEV_OTP}`,
        };
      }

      // Sign up / sign in anonymously then upsert a profile row
      const { data: anonData, error: anonErr } =
        await supabase.auth.signInAnonymously();
      if (anonErr || !anonData.user) {
        return {
          success: false,
          user: null,
          error: anonErr?.message ?? "Anonymous sign-in failed",
        };
      }

      const uid = anonData.user.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingProfile } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("phone", phone)
        .maybeSingle();

      let user: UserProfile | null = null;
      if (existingProfile) {
        user = existingProfile as UserProfile;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("profiles").upsert({
          id: uid,
          phone,
          full_name: "Guest",
          role: "customer",
        });
        user = await getUserProfile(uid);
      }

      sessionStorage.removeItem("senik_dev_phone");
      return { success: true, user };
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error) {
      return { success: false, user: null, error: error.message };
    }

    if (!data.user) {
      return { success: false, user: null, error: "Verification failed" };
    }

    const user = await mapUserProfile(data.user.id);
    return { success: true, user };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed";
    return { success: false, user: null, error: message };
  }
}

export async function resendOtp(phone: string): Promise<SendOtpResult> {
  return sendOtp(phone);
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  try {
    const { data, error } = await (
      supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from("profiles") as any
    )
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      full_name: data.full_name,
      phone: data.phone,
      email: data.email,
      role: data.role,
      zone_id: data.zone_id,
      created_at: data.created_at,
    };
  } catch {
    return null;
  }
}

async function mapUserProfile(userId: string): Promise<UserProfile | null> {
  return getUserProfile(userId);
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) return null;
  return data.session;
}
