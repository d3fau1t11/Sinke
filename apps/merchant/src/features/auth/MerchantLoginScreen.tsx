import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { businessesApi } from "@senik/api";
import { Card, Button } from "@senik/ui";
import type { Business } from "@senik/types";
import { useMerchantAuthStore } from "./store/merchantAuthStore";

export function MerchantLoginScreen() {
  const navigate = useNavigate();
  const { setMerchant } = useMerchantAuthStore();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
          ስንቅ
        </div>
        <h1 className="text-2xl font-bold text-on-surface">
          Senik Merchant Portal
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          የነጋዴ መግቢያ • Select your restaurant or shop
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant">
            Loading merchants...
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {businesses.map((biz) => (
            <Card
              key={biz.id}
              variant="outlined"
              padding="md"
              hoverable
              onClick={() => handleSelect(biz)}
              className="cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={biz.avatar_image}
                  alt={biz.name_en}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-on-surface truncate">
                    {biz.name_en}
                  </h3>
                  <p className="text-xs text-on-surface-variant truncate">
                    {biz.name_am}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      biz.is_open
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {biz.is_open ? "Open for Orders" : "Closed"}
                  </span>
                </div>
                <Button size="sm" variant="ghost">
                  Select
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
