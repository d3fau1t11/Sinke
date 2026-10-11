import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, SenikLogo } from "@senik/ui";
import { useAdminAuthStore } from "./store/adminAuthStore";

export function AdminLoginScreen() {
  const navigate = useNavigate();
  const { login, loginDemo, loginError, clearError } = useAdminAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    setTimeout(() => {
      const ok = login(email.trim(), password);
      setLoading(false);
      if (ok) navigate("/overview");
    }, 400);
  };

  const handleDemo = () => {
    loginDemo();
    navigate("/overview");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      {/* Decorative panels */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900 flex-col justify-between p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent" />
        <div className="relative z-10 flex items-center gap-3">
          <SenikLogo size="lg" />
          <span className="text-white font-bold text-lg">
            Senik Admin Console
          </span>
        </div>
        <div className="relative z-10 space-y-6">
          {[
            {
              icon: "📊",
              title: "Real-time Analytics",
              desc: "Live GMV, orders, and fleet status",
            },
            {
              icon: "🧑‍🤝‍🧑",
              title: "User Management",
              desc: "Customers, merchants & riders in one view",
            },
            {
              icon: "🗺️",
              title: "Zone Control",
              desc: "Manage delivery areas across Ethiopia",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="text-white font-bold text-sm">{f.title}</p>
                <p className="text-slate-400 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs relative z-10">
          © 2025 Senik Technologies · Addis Ababa
        </p>
      </div>

      {/* Login panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4 lg:hidden">
              <SenikLogo size="lg" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Sign In</h1>
            <p className="text-sm text-slate-400 mt-1">
              Operations & Fleet Management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="admin@senik.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-medium bg-red-950/60 border border-red-800/40 rounded-lg px-3 py-2">
                ⚠️ {loginError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 font-bold"
              loading={loading}
            >
              Sign In to Console
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-950 px-3 text-slate-500">
                or use demo access
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemo}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl py-3 text-sm font-bold transition-all group"
          >
            <span className="text-lg">⚡</span>
            <span>One-Click Demo Login</span>
            <span className="text-[10px] text-slate-400 group-hover:text-slate-300">
              · admin@senik.et
            </span>
          </button>

          <div className="text-center text-[11px] text-slate-600">
            <p>
              Demo creds:{" "}
              <span className="font-mono text-slate-500">
                admin@senik.et / senik2025
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
