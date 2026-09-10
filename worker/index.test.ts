import assert from "node:assert/strict";
import test from "node:test";

import { validateEnquiryPayload } from "../lib/enquiry.ts";
import worker, { createEmailPayload, type EmailMessageBuilder, type WorkerEnv } from "./index.ts";

const validPayload = {
  name: "María O’Connor-Wu",
  company: "A&B Projects 2.0",
  email: "maria+warehouse@exämple.com",
  phone: "+61 412 345 678",
  interest: "lease",
  message: "We are looking for a flexible warehouse and office space.",
  turnstileToken: "valid-token",
  website: "",
};

test("accepts inclusive names, internationalised email domains and international phone formatting", () => {
  const result = validateEnquiryPayload(validPayload);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.email, "maria+warehouse@xn--exmple-cua.com");
    assert.equal(result.data.phone, "+61 412 345 678");
  }
});

test("accepts Australian local numbers, overseas numbers, extensions and Unicode combining marks", () => {
  const cases = [
    { phone: "0412 345 678", email: "संपर्क@उदाहरण.भारत" },
    { phone: "+1 212 555 0123 ext. 45", email: "customer+east@sub.example.travel" },
    { phone: "0044 20 7946 0958", email: "first.last@example.co.uk" },
  ];

  for (const values of cases) {
    const result = validateEnquiryPayload({ ...validPayload, ...values });
    assert.equal(result.success, true, `${values.phone} and ${values.email} should be accepted`);
  }
});

test("rejects truncated numbers, prose around numbers, malformed domains and oversized values", () => {
  const cases = [
    { field: "phone", values: { phone: "+61 4" } },
    { field: "phone", values: { phone: "Please call 0412 345 678 tomorrow" } },
    { field: "email", values: { email: ".name@example.com" } },
    { field: "email", values: { email: "name@example..com" } },
    { field: "email", values: { email: "name@-example.com" } },
    { field: "message", values: { message: "x".repeat(2_001) } },
    { field: "name", values: { name: `Alice\nBcc: attacker@example.com` } },
  ] as const;

  for (const testCase of cases) {
    const result = validateEnquiryPayload({ ...validPayload, ...testCase.values });
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.errors[testCase.field], `${testCase.field} should have an error`);
    }
  }
});

test("returns a specific error for every invalid field", () => {
  const result = validateEnquiryPayload({
    name: "---",
    company: "***",
    email: "person@@example",
    phone: "123",
    interest: "delete-everything",
    message: "short",
    turnstileToken: "",
    website: "",
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.deepEqual(Object.keys(result.errors).sort(), [
      "company",
      "email",
      "interest",
      "message",
      "name",
      "phone",
      "turnstile",
    ]);
  }
});

test("marks the honeypot as spam without exposing that decision", () => {
  const result = validateEnquiryPayload({ ...validPayload, website: "https://spam.invalid" });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.isSpam, true);
  }
});

test("escapes user input in the HTML email and keeps it in the plain-text alternative", () => {
  const result = validateEnquiryPayload({
    ...validPayload,
    name: "Alice <Admin>",
    message: "Interested in <script>alert('x')</script> space.",
  });
  assert.equal(result.success, true);
  if (!result.success) return;

  const email = createEmailPayload(
    result.data,
    { ENQUIRY_FROM_ADDRESS: "website@besa.test", ENQUIRY_TO_ADDRESS: "owner@example.com" },
    "reference-123",
    new Date("2026-09-04T01:00:00Z"),
  );

  assert.doesNotMatch(email.html, /<script>/u);
  assert.match(email.html, /&lt;script&gt;/u);
  assert.match(email.text, /<script>alert\('x'\)<\/script>/u);
});

test("the endpoint validates Turnstile and sends one fixed-recipient email", async () => {
  const sent: EmailMessageBuilder[] = [];
  const allow = { limit: async () => ({ success: true }) };
  const env: WorkerEnv = {
    ASSETS: { fetch: async () => new Response("asset") },
    ENQUIRY_EMAIL: {
      send: async (message) => {
        sent.push(message);
        return { messageId: "message-1" };
      },
    },
    ENQUIRY_RATE_LIMITER: allow,
    ENQUIRY_GLOBAL_LIMITER: allow,
    ENQUIRY_FROM_ADDRESS: "website@besa.test",
    ENQUIRY_TO_ADDRESS: "owner@example.com",
    ENVIRONMENT: "production",
    TURNSTILE_SECRET_KEY: "unit-test-production-secret",
  };

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => Response.json({
    success: true,
    action: "enquiry_submit",
    hostname: "besa.test",
  })) as typeof fetch;

  try {
    const response = await worker.fetch(new Request("https://besa.test/api/enquire", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://besa.test",
        "Sec-Fetch-Site": "same-origin",
        "CF-Connecting-IP": "203.0.113.10",
      },
      body: JSON.stringify(validPayload),
    }), env);

    assert.equal(response.status, 200);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].to, "owner@example.com");
    assert.deepEqual(sent[0].replyTo, {
      email: "maria+warehouse@xn--exmple-cua.com",
      name: "María O’Connor-Wu",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("the endpoint rejects cross-origin submissions before sending", async () => {
  let sends = 0;
  const allow = { limit: async () => ({ success: true }) };
  const env: WorkerEnv = {
    ASSETS: { fetch: async () => new Response("asset") },
    ENQUIRY_EMAIL: { send: async () => { sends += 1; return { messageId: "message-1" }; } },
    ENQUIRY_RATE_LIMITER: allow,
    ENQUIRY_GLOBAL_LIMITER: allow,
    ENQUIRY_FROM_ADDRESS: "website@besa.test",
    ENQUIRY_TO_ADDRESS: "owner@example.com",
    ENVIRONMENT: "production",
    TURNSTILE_SECRET_KEY: "unit-test-production-secret",
  };

  const response = await worker.fetch(new Request("https://besa.test/api/enquire", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://attacker.test" },
    body: JSON.stringify(validPayload),
  }), env);

  assert.equal(response.status, 403);
  assert.equal(sends, 0);
});
