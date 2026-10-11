import React, { useState } from "react";
import { Button, Input } from "@senik/ui";
import { formatETB } from "@senik/utils";
import { useMerchantWalletStore } from "./store/merchantWalletStore";

interface WithdrawalModalProps {
  businessId: string;
  availableBalance: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function WithdrawalModal({
  businessId,
  availableBalance,
  isOpen,
  onClose,
  onSuccess,
}: WithdrawalModalProps) {
  const { requestWithdrawal } = useMerchantWalletStore();
  const [method, setMethod] = useState<"cbe" | "telebirr">("cbe");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amount = Number(amountStr);
    if (!amount || amount <= 0) return setError("Please enter a valid amount.");
    if (amount > availableBalance)
      return setError(`Amount exceeds balance ${formatETB(availableBalance)}.`);
    if (amount < 50) return setError("Minimum withdrawal is 50 ETB.");
    if (!accountNumber.trim())
      return setError(
        method === "cbe" ? "Enter CBE account." : "Enter telebirr phone.",
      );
    if (!accountName.trim()) return setError("Enter registered account name.");

    setLoading(true);
    setTimeout(() => {
      requestWithdrawal({
        businessId,
        amount,
        method,
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
      });
      setLoading(false);
      onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl p-6 shadow-2xl border border-outline/10 space-y-4">
        <div className="flex justify-between items-center border-b border-outline/10 pb-3">
          <div>
            <h3 className="font-bold text-lg text-on-surface">
              Request Withdrawal
            </h3>
            <p className="text-xs text-on-surface-variant">
              Available:{" "}
              <span className="font-mono font-bold text-primary">
                {formatETB(availableBalance)}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMethod("cbe")}
              className={`p-2.5 rounded-xl border text-left ${method === "cbe" ? "border-primary bg-primary/10 text-primary font-bold" : "border-outline/20 text-on-surface"}`}
            >
              <div className="text-sm">🏦 CBE</div>
              <div className="text-[10px] text-on-surface-variant">
                Commercial Bank
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMethod("telebirr")}
              className={`p-2.5 rounded-xl border text-left ${method === "telebirr" ? "border-secondary bg-secondary/10 text-secondary font-bold" : "border-outline/20 text-on-surface"}`}
            >
              <div className="text-sm">📱 telebirr</div>
              <div className="text-[10px] text-on-surface-variant">
                Mobile Payout
              </div>
            </button>
          </div>

          <Input
            label={
              method === "cbe" ? "CBE Account Number" : "telebirr Phone Number"
            }
            placeholder={method === "cbe" ? "1000..." : "+2519..."}
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            fullWidth
          />
          <Input
            label="Account Holder Full Name"
            placeholder="e.g. Abebe Bikila"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            fullWidth
          />

          <div>
            <Input
              label="Withdrawal Amount (ETB)"
              type="number"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              fullWidth
            />
            <div className="flex gap-2 mt-1.5">
              {[0.25, 0.5, 1.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() =>
                    setAmountStr(String(Math.floor(availableBalance * pct)))
                  }
                  className="px-2 py-0.5 rounded text-[11px] bg-surface-container border border-outline/10 text-on-surface-variant hover:text-primary"
                >
                  {pct === 1.0 ? "100% (All)" : `${pct * 100}%`}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-error font-medium">{error}</p>}

          <div className="pt-2 flex gap-2">
            <Button type="button" variant="ghost" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
