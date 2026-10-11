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
      <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-level-3 space-y-4">
        <div className="flex justify-between items-start border-b border-outline-variant/60 pb-3">
          <div>
            <h3 className="font-display font-bold text-title-md text-on-surface">
              Request Withdrawal
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              Available:{" "}
              <span className="font-mono font-bold text-secondary tabular-nums">
                {formatETB(availableBalance)}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 -mr-1 -mt-1 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Payout method — selection uses the terracotta border pattern */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMethod("cbe")}
              aria-pressed={method === "cbe"}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                method === "cbe"
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-surface-container-low hover:bg-surface-container"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  account_balance
                </span>
                <span className="text-body-sm font-bold text-on-surface">
                  CBE
                </span>
              </span>
              <span className="text-label-sm text-on-surface-variant block mt-0.5">
                Commercial Bank
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMethod("telebirr")}
              aria-pressed={method === "telebirr"}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                method === "telebirr"
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-surface-container-low hover:bg-surface-container"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  smartphone
                </span>
                <span className="text-body-sm font-bold text-on-surface">
                  telebirr
                </span>
              </span>
              <span className="text-label-sm text-on-surface-variant block mt-0.5">
                Mobile Payout
              </span>
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
                  className="px-2.5 py-1 rounded-full text-label-sm font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors tabular-nums"
                >
                  {pct === 1.0 ? "100% (All)" : `${pct * 100}%`}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-body-sm text-error font-medium" role="alert">
              {error}
            </p>
          )}

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
