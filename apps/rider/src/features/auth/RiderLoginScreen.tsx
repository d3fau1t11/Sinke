import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card, SenikLogo } from "@senik/ui";
import { useRiderAuthStore } from "./store/riderAuthStore";

const DEMO_RIDERS = [
  { name: "Koye Bajaj 01", phone: "0911002233", icon: "moped" },
  { name: "Tulu Motor 02", phone: "0922334455", icon: "two_wheeler" },
  { name: "Selam Bike 03", phone: "0933556677", icon: "pedal_bike" },
];

export function RiderLoginScreen() {
  const navigate = useNavigate();
  const { setRider } = useRiderAuthStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const login = (riderName: string, riderPhone: string) => {
    const id = `rider-${riderPhone.replace(/\D/g, "")}`;
    setRider(id, riderName, riderPhone);
    navigate("/deliveries");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your full name");
    if (!phone.trim()) return setError("Please enter your phone number");
    login(name.trim(), phone.trim());
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col overflow-hidden">
      {/* Tibeb accent strip */}
      <div className="h-1 tibeb-accent-strip shrink-0" aria-hidden="true" />

      {/* Soft brand glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary-fixed/40 blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-tertiary-fixed/30 blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 py-10 max-w-md mx-auto w-full relative z-10">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SenikLogo size="xl" />
          </div>
          <h1 className="font-display font-black text-title-xl text-on-surface tracking-tight">
            Senik Rider
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            <span className="text-secondary font-bold">Earn More.</span> Deliver
            Faster. · <span className="font-medium">የአሽከርካሪ</span>
          </p>
        </div>

        {/* One-Click Demo */}
        <div className="mb-5">
          <p className="text-micro font-bold text-on-surface-variant uppercase tracking-[0.08em] text-center mb-2.5">
            Quick Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_RIDERS.map((r) => (
              <button
                key={r.phone}
                type="button"
                onClick={() => login(r.name, r.phone)}
                className="p-3 rounded-2xl bg-surface-container-lowest shadow-level-1 hover:shadow-level-2 active:scale-95 transition-all text-center"
              >
                <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[20px]">
                    {r.icon}
                  </span>
                </span>
                <span className="text-label-sm font-bold text-primary block mt-1.5 leading-tight">
                  {r.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-outline-variant/60" />
          <span className="text-label-sm text-on-surface-variant font-medium">
            or sign in manually
          </span>
          <div className="flex-1 h-px bg-outline-variant/60" />
        </div>

        {/* Manual Login */}
        <Card padding="lg" className="space-y-3">
          <form onSubmit={handleLogin} className="space-y-3">
            <Input
              label="Full Name / ሙሉ ስም"
              placeholder="e.g. Abebe Bikila"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Phone Number / ስልክ ቁጥር"
              placeholder="+251 9..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {error && (
              <p className="text-body-sm text-error font-medium" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" variant="primary" fullWidth size="lg">
              Log In as Rider
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
