import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card } from "@senik/ui";
import { useRiderAuthStore } from "./store/riderAuthStore";

export function RiderLoginScreen() {
  const navigate = useNavigate();
  const { setRider } = useRiderAuthStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    // Set rider profile
    const id = `rider-${phone.replace(/\D/g, "") || Date.now()}`;
    setRider(id, name, phone);
    navigate("/deliveries");
  };

  const handleDemoRider = (riderName: string, riderPhone: string) => {
    const id = `rider-${riderPhone.replace(/\D/g, "")}`;
    setRider(id, riderName, riderPhone);
    navigate("/deliveries");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-secondary text-white flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
          🚴
        </div>
        <h1 className="text-2xl font-bold text-on-surface">
          Senik Rider Portal
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          የአሽከርካሪ መግቢያ • Bajaj & Motorcycle Deliveries
        </p>
      </div>

      <Card variant="outlined" padding="lg" className="space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
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
          {error && <p className="text-xs text-error">{error}</p>}
          <Button type="submit" variant="primary" className="w-full">
            Log In as Rider
          </Button>
        </form>

        <div className="pt-2 border-t border-outline/10">
          <p className="text-xs text-on-surface-variant text-center mb-2">
            Quick Demo Riders:
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 text-xs"
              onClick={() => handleDemoRider("Koye Bajaj 01", "0911002233")}
            >
              Koye Bajaj #1
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 text-xs"
              onClick={() => handleDemoRider("Tulu Motor 02", "0922334455")}
            >
              Tulu Motor #2
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
