import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@senik/i18n";
import { Button } from "@senik/ui";
import { supabase } from "@senik/api";
import { useAuthStore } from "./store/authStore";
import { verifyOtp, resendOtp } from "./authService";

const isDevMode = import.meta.env.VITE_APP_ENV !== "production";

export function OtpVerificationScreen() {
  const { isAm } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession, setUser } = useAuthStore();

  const phone = (location.state as { phone?: string })?.phone || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    setCanResend(true);
  }, [cooldown]);

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    setError("");
    setLoading(true);

    const result = await verifyOtp(phone, code);

    setLoading(false);

    if (result.success && result.user) {
      // Grab the live session token (works for both OTP and anonymous sign-in)
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionToken = sessionData.session?.access_token ?? "";
      const expiresAt = sessionData.session?.expires_at
        ? sessionData.session.expires_at * 1000
        : Date.now() + 3600000;
      setSession({ access_token: sessionToken, expires_at: expiresAt });
      setUser(result.user);
      navigate("/onboarding", { replace: true });
    } else {
      setError(result.error || (isAm ? "የተሳሳተ ኮድ" : "Invalid code"));
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setError("");

    const result = await resendOtp(phone);

    setResendLoading(false);

    if (result.success) {
      setCooldown(60);
      setCanResend(false);
    } else {
      setError(result.error || (isAm ? "ስህተት ተከስቷል" : "Failed to resend"));
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    if (newOtp.every((v) => v.length === 1)) {
      handleVerify();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-level-2">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-on-surface">
            {isAm ? "የአንድ ጊዜ የሚሰራ ኮድ" : "Enter Verification Code"}
          </h1>
          <p className="mt-2 text-on-surface-variant">
            {isAm
              ? `ወደ ${phone} የተላከ ኮድን ያስገቡ`
              : `Enter the code sent to ${phone}`}
          </p>
          {isDevMode && (
            <p className="mt-2 text-xs bg-amber-100 text-amber-800 rounded-lg px-3 py-1 inline-block">
              🛠 Dev mode — use code <strong>123456</strong>
            </p>
          )}
        </div>

        <div
          className="flex justify-center gap-2 mb-6"
          role="group"
          aria-label="OTP inputs"
        >
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl font-bold bg-surface-container-lowest border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              maxLength={1}
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-error text-sm mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onClick={handleVerify}
            disabled={otp.some((v) => !v) || loading}
          >
            {isAm ? "አረጋግጥ" : "Verify"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth
            loading={resendLoading}
            onClick={handleResend}
            disabled={!canResend || resendLoading}
          >
            {canResend
              ? isAm
                ? "እንደገና ላክ"
                : "Resend Code"
              : isAm
                ? `እንደገና ላክ (${cooldown}s)`
                : `Resend (${cooldown}s)`}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          {isAm ? "ኮድን አልተቀበልም?" : "Didn't receive the code?"}
        </p>
      </div>
    </div>
  );
}
