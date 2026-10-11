import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { businessesApi } from "@senik/api";
import { Card, Button, Input, SenikLogo } from "@senik/ui";
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Tibeb accent strip */}
      <div className="h-1 tibeb-accent-strip" aria-hidden="true" />

      <div className="flex-1 flex flex-col justify-center px-4 py-8 max-w-md mx-auto w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <SenikLogo size="lg" />
          </div>
          <h1 className="font-display font-extrabold text-title-xl text-on-surface">
            Senik Merchant Portal
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            የነጋዴ መግቢያ · Restaurant &amp; Store Operations
          </p>
        </div>

        <div className="space-y-4">
          <Card padding="lg" className="space-y-4">
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleOneClickLogin}
              disabled={loading || businesses.length === 0}
              className="shadow-floating"
            >
              <span className="material-symbols-outlined text-[19px] fill-icon">
                bolt
              </span>
              One-Click Instant Login
            </Button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-outline-variant/60" />
              <span className="flex-shrink mx-3 text-micro text-on-surface-variant uppercase font-bold tracking-[0.05em]">
                Or Sign In with Credentials
              </span>
              <div className="flex-grow border-t border-outline-variant/60" />
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
              className="text-label-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">
                swap_horiz
              </span>
              {showStorePicker
                ? "Hide Store Switcher"
                : "Choose a Different Registered Restaurant"}
            </button>
          </div>

          {showStorePicker && (
            <div className="space-y-2 pt-2">
              {businesses.map((biz) => (
                <button
                  type="button"
                  key={biz.id}
                  onClick={() => handleSelect(biz)}
                  className="w-full text-left p-3 rounded-2xl bg-surface-container-lowest shadow-level-1 hover:shadow-level-2 cursor-pointer flex items-center gap-3 transition-all"
                >
                  <img
                    src={biz.avatar_image}
                    alt={biz.name_en}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-body-sm text-on-surface truncate">
                      {biz.name_en}
                    </h4>
                    <p className="text-label-sm text-on-surface-variant truncate">
                      {biz.name_am}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
