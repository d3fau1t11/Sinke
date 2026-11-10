import assert from "node:assert/strict";
import { test } from "node:test";
import { checkPublication } from "./security-files.mjs";
import { rejectOnlinePayment } from "../supabase/functions/_shared/online-payments.mjs";

test("publication allows only the root README and environment templates", () => {
  assert.doesNotThrow(() =>
    checkPublication(["README.md", ".env.example", "apps/rider/.env.example"]),
  );
  for (const path of ["AGENTS.md", "docs/README.md", "notes.Md", "README.MD"]) {
    assert.throws(() => checkPublication([path]), /excluded publication files/);
  }
});

test("publication rejects credentials and generated artifacts", () => {
  for (const path of [
    ".env",
    "apps/customer/.env.prod",
    "signing.jks",
    "identity.pfx",
    "private.pem",
    "google-services.json",
    "GoogleService-Info.plist",
    "firebase-service-account.json",
    "apps/customer/dist/index.js",
    "scratch/notes.txt",
  ]) {
    assert.throws(() => checkPublication([path]), /excluded publication files/);
  }
});

test("forged payment notifications cannot report success or access a backend", async () => {
  const request = new Request("https://example.test/payment-webhook", {
    method: "POST",
    headers: {
      "X-Chapa-Signature": "forged",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reference: "existing-order",
      status: "success",
      amount: 500,
    }),
  });
  const response = rejectOnlinePayment(request);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: "Online payments are unavailable. Choose cash on delivery.",
  });
  assert.equal(request.bodyUsed, false);
});

test("payment endpoint rejects other HTTP methods", () => {
  const response = rejectOnlinePayment(
    new Request("https://example.test/payment-webhook"),
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "POST");
});
