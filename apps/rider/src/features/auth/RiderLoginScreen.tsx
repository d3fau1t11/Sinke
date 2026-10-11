import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card } from "@senik/ui";
import { useRiderAuthStore } from "./store/riderAuthStore";

const DEMO_RIDERS = [
  { name: "Koye Bajaj 01", phone: "0911002233", emoji: "🛺" },
  { name: "Tulu Motor 02", phone: "0922334455", emoji: "🏍" },
  { name: "Selam Bike 03", phone: "0933556677", emoji: "🚴" },
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
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 py-10 max-w-md mx-auto w-full relative z-10">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-green-500/30 text-4xl">
            🚴
          </div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">
            Senik Rider
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            <span className="text-green-600 font-bold">Earn More.</span> Deliver
            Faster. · <span className="font-medium">የአሽከርካሪ</span>
          </p>
        </div>

        {/* One-Click Demo */}
        <div className="mb-5">
          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center mb-2">
            ⚡ Quick Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_RIDERS.map((r) => (
              <button
                key={r.phone}
                type="button"
                onClick={() => login(r.name, r.phone)}
                className="p-2.5 rounded-2xl border-2 border-green-500/20 bg-green-50/50 hover:bg-green-50 hover:border-green-500/50 active:scale-95 transition-all text-center group"
              >
                <span className="text-2xl block">{r.emoji}</span>
                <span className="text-[10px] font-bold text-green-700 block mt-1 leading-tight truncate">
                  {r.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-outline/10" />
          <span className="text-[11px] text-on-surface-variant font-medium">
            or sign in manually
          </span>
          <div className="flex-1 h-px bg-outline/10" />
        </div>

        {/* Manual Login */}
        <Card variant="outlined" padding="lg" className="space-y-3">
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
            {error && <p className="text-xs text-error font-medium">{error}</p>}
            <Button
              type="submit"
              variant="primary"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Log In as Rider
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
