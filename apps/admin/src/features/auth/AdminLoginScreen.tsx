import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button } from "@senik/ui";
import { useAdminAuthStore } from "./store/adminAuthStore";

export function AdminLoginScreen() {
  const navigate = useNavigate();
  const { login } = useAdminAuthStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter admin access key");
      return;
    }
    // Authenticate admin session
    login("Senik Admin Head");
    navigate("/overview");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-xl">
            ስንቅ
          </div>
          <h1 className="text-2xl font-bold text-white">Senik Admin Console</h1>
          <p className="text-sm text-slate-400 mt-1">
            Operations & Fleet Management Platform
          </p>
        </div>

        <Card
          variant="outlined"
          padding="lg"
          className="bg-slate-800 border-slate-700 text-white space-y-4"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              label="Admin Passcode / Access Key"
              placeholder="Enter master key..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button type="submit" variant="primary" className="w-full py-3">
              Enter Operations Console
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-700/60 text-center">
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-slate-400 hover:text-white"
              onClick={() => {
                login("Operations Manager");
                navigate("/overview");
              }}
            >
              Demo One-Click Sign In
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
