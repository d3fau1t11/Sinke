export function isValidPhone(phone: string): boolean {
  const ethiopianPhoneRegex = /^(\+251|0)[1-9]\d{8}$/;
  return ethiopianPhoneRegex.test(phone.replace(/[\s-]/g, ''));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, '');
}

export function formatPhone(phone: string): string {
  const cleaned = sanitizePhone(phone);
  if (cleaned.startsWith('0')) {
    return `+251${cleaned.substring(1)}`;
  }
  return cleaned;
}