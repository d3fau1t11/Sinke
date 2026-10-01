export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SNK-${timestamp}-${random}`;
}

export function generateIdempotencyKey(): string {
  return `idem-${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
}