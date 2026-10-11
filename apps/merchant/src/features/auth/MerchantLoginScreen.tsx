import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { businessesApi } from "@senik/api";
import { Card, Button, Input } from "@senik/ui";
import type { Business } from "@senik/types";
import { useMerchantAuthStore } from "./store/merchantAuthStore";

export function MerchantLoginScreen() {
  const navigate = useNavigate();
  const { setMerchant } = useMerchantAuthStore();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("+251911223344");
  const [password, setPassword] = useState("••••••••");
  const [showStorePicker, setShowStorePicker] = useState(false);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        const data = await businessesApi.getAll();
        setBusinesses(data);
      } catch (err) {
        console.error("Failed to load businesses", err);
      } finally {
        setLoading(false);
      }
    }
    void loadBusinesses();
  }, []);

  const handleSelect = (biz: Business) => {
    setMerchant(biz.id, biz.name_en, biz.name_am, biz.is_open);
    navigate("/dashboard");
  };

  const handleOneClickLogin = () => {
    const defaultBiz = businesses[0];
    if (defaultBiz) {
      handleSelect(defaultBiz);
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleOneClickLogin();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-3 text-2xl font-bold shadow-lg">
          ስንቅ
        </div>
        <h1 className="text-2xl font-bold text-on-surface">
          Senik Merchant Portal
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          የነጋዴ መግቢያ • Restaurant & Store Operations
        </p>
      </div>

      <div className="space-y-4">
        <Card
          variant="outlined"
          padding="lg"
          className="border-primary/20 bg-surface shadow-level-2 space-y-4"
        >
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleOneClickLogin}
            disabled={loading || businesses.length === 0}
            className="shadow-floating flex items-center justify-center gap-2"
          >
            <span>⚡ One-Click Instant Login</span>
          </Button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-outline/20" />
            <span className="flex-shrink mx-3 text-[11px] text-on-surface-variant uppercase font-semibold">
              Or Sign In with Credentials
            </span>
            <div className="flex-grow border-t border-outline/20" />
          </div>

          <form onSubmit={handleFormLogin} className="space-y-3">
            <Input
              label="Merchant Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251 9..."
              fullWidth
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              fullWidth
            />
            <Button
              type="submit"
              variant="secondary"
              fullWidth
              disabled={loading}
            >
              Sign In to Dashboard
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowStorePicker(!showStorePicker)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {showStorePicker
              ? "Hide Store Switcher"
              : "⇄ Or Choose a Different Registered Restaurant"}
          </button>
        </div>

        {showStorePicker && (
          <div className="space-y-2 pt-2 border-t border-outline/10">
            {businesses.map((biz) => (
              <button
                type="button"
                key={biz.id}
                onClick={() => handleSelect(biz)}
                className="w-full text-left p-2.5 rounded-xl border border-outline/10 bg-surface hover:border-primary cursor-pointer flex items-center gap-3 transition-all"
              >
                <img
                  src={biz.avatar_image}
                  alt={biz.name_en}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-on-surface truncate">
                    {biz.name_en}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {biz.name_am}
                  </p>
                </div>
                <span className="text-xs text-primary font-semibold">
                  Select →
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
