import {
  INTEREST_OPTIONS,
  normalizeEmailAddress,
  validateEnquiryPayload,
  type EnquiryData,
  type EnquiryFieldErrors,
} from "../lib/enquiry.ts";

export interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailMessageBuilder {
  to: string | EmailAddress;
  from: string | EmailAddress;
  subject: string;
  html: string;
  text: string;
  replyTo: string | EmailAddress;
  headers?: Record<string, string>;
}

export interface SendEmailBinding {
  send(message: EmailMessageBuilder): Promise<{ messageId: string }>;
}

export interface WorkerEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
  ENQUIRY_EMAIL: SendEmailBinding;
  ENQUIRY_RATE_LIMITER: RateLimitBinding;
  ENQUIRY_GLOBAL_LIMITER: RateLimitBinding;
  ENQUIRY_FROM_ADDRESS: string;
  ENQUIRY_TO_ADDRESS: string;
  ENVIRONMENT: "development" | "production";
  TURNSTILE_SECRET_KEY?: string;
}

interface TurnstileResult {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
}

const API_PATHS = new Set(["/api/enquire", "/api/enquire/"]);
const MAX_BODY_BYTES = 16 * 1024;
const EXPECTED_TURNSTILE_ACTION = "enquiry_submit";
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
} as const;

function jsonResponse(body: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...RESPONSE_HEADERS, ...extraHeaders },
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function emailRow(label: string, value: string): string {
  return `<tr><td style="padding:10px 14px 10px 0;color:#617087;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:10px 0;color:#07162c;font-size:15px;line-height:1.5;vertical-align:top">${escapeHtml(value)}</td></tr>`;
}

export function createEmailPayload(
  enquiry: EnquiryData,
  env: Pick<WorkerEnv, "ENQUIRY_FROM_ADDRESS" | "ENQUIRY_TO_ADDRESS">,
  reference: string,
  receivedAt: Date,
): EmailMessageBuilder {
  const interest = INTEREST_OPTIONS[enquiry.interest];
  const company = enquiry.company || "Not supplied";
  const timestamp = receivedAt.toLocaleString("en-AU", {
    timeZone: "Australia/Melbourne",
    dateStyle: "full",
    timeStyle: "short",
  });
  const safeMessage = escapeHtml(enquiry.message).replace(/\n/gu, "<br>");

  const text = [
    "NEW BESA PARK WEBSITE ENQUIRY",
    "",
    `Name: ${enquiry.name}`,
    `Company: ${company}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone}`,
    `Interest: ${interest}`,
    "",
    "Message:",
    enquiry.message,
    "",
    `Received: ${timestamp}`,
    `Reference: ${reference}`,
    "",
    "Reply to this email to contact the enquirer directly.",
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f5f7;font-family:Arial,Helvetica,sans-serif;color:#07162c">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f5f7;padding:28px 12px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-top:5px solid #ec7731;box-shadow:0 14px 40px rgba(7,22,44,.12)">
          <tr><td style="padding:36px 38px 24px">
            <p style="margin:0 0 10px;color:#c64f17;font-size:11px;font-weight:800;letter-spacing:.15em;text-transform:uppercase">BESA Park</p>
            <h1 style="margin:0;font-size:30px;line-height:1.15;letter-spacing:-.03em">New website enquiry</h1>
            <p style="margin:12px 0 0;color:#617087;font-size:14px;line-height:1.6">A prospective occupier or investor has registered their interest.</p>
          </td></tr>
          <tr><td style="padding:0 38px 24px">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #eadfd6;border-bottom:1px solid #eadfd6">
              ${emailRow("Name", enquiry.name)}
              ${emailRow("Company", company)}
              ${emailRow("Email", enquiry.email)}
              ${emailRow("Phone", enquiry.phone)}
              ${emailRow("Interest", interest)}
            </table>
          </td></tr>
          <tr><td style="padding:0 38px 30px">
            <p style="margin:0 0 9px;color:#617087;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase">What they have in mind</p>
            <div style="padding:18px 20px;background:#fff3eb;border-left:3px solid #c64f17;color:#07162c;font-size:15px;line-height:1.65">${safeMessage}</div>
          </td></tr>
          <tr><td style="padding:20px 38px;background:#07162c;color:#cbd4df;font-size:11px;line-height:1.7">
            Received ${escapeHtml(timestamp)}<br>Reference ${escapeHtml(reference)}<br>Reply to this email to contact ${escapeHtml(enquiry.name)} directly.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return {
    to: env.ENQUIRY_TO_ADDRESS,
    from: { email: env.ENQUIRY_FROM_ADDRESS, name: "BESA Park website" },
    replyTo: { email: enquiry.email, name: enquiry.name },
    subject: `New BESA Park enquiry — ${interest}`,
    html,
    text,
    headers: { "X-BESA-Enquiry-Reference": reference },
  };
}

async function verifyTurnstile(
  token: string,
  request: Request,
  env: WorkerEnv,
): Promise<"valid" | "invalid" | "unavailable" | "misconfigured"> {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret || (env.ENVIRONMENT === "production" && secret === TURNSTILE_TEST_SECRET)) {
    return "misconfigured";
  }

  const verificationBody = new FormData();
  verificationBody.set("secret", secret);
  verificationBody.set("response", token);
  verificationBody.set("idempotency_key", crypto.randomUUID());

  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) {
    verificationBody.set("remoteip", remoteIp);
  }

  let response: Response;
  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: verificationBody,
      signal: AbortSignal.timeout(5_000),
    });
  } catch {
    return "unavailable";
  }

  if (!response.ok) {
    return "unavailable";
  }

  const result = await response.json() as TurnstileResult;
  if (!result.success) {
    return "invalid";
  }

  if (env.ENVIRONMENT === "development" && secret === TURNSTILE_TEST_SECRET) {
    return "valid";
  }

  const expectedHostname = new URL(request.url).hostname;
  return result.action === EXPECTED_TURNSTILE_ACTION && result.hostname === expectedHostname
    ? "valid"
    : "invalid";
}

function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("Origin");
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  return origin === new URL(request.url).origin && (!fetchSite || fetchSite === "same-origin");
}

async function handleEnquiry(request: Request, env: WorkerEnv): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405, { Allow: "POST" });
  }

  if (!isSameOriginRequest(request)) {
    return jsonResponse({ ok: false, message: "This request was not accepted." }, 403);
  }

  if (!env.ENQUIRY_RATE_LIMITER || !env.ENQUIRY_GLOBAL_LIMITER) {
    return jsonResponse({ ok: false, message: "Enquiries are temporarily unavailable. Please try again later." }, 503);
  }

  const rateLimitKey = request.headers.get("CF-Connecting-IP") || "unknown-client";
  const [visitorLimit, globalLimit] = await Promise.all([
    env.ENQUIRY_RATE_LIMITER.limit({ key: rateLimitKey }),
    env.ENQUIRY_GLOBAL_LIMITER.limit({ key: "all-enquiries" }),
  ]);

  if (!visitorLimit.success || !globalLimit.success) {
    return jsonResponse(
      { ok: false, message: "Too many enquiries were sent. Please wait a minute and try again." },
      429,
      { "Retry-After": "60" },
    );
  }

  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, message: "The enquiry was too large to process." }, 413);
  }

  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ ok: false, message: "Unsupported request format." }, 415);
  }

  let rawBody: string;
  let payload: unknown;
  try {
    rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonResponse({ ok: false, message: "The enquiry was too large to process." }, 413);
    }
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ ok: false, message: "The enquiry could not be read." }, 400);
  }

  const validation = validateEnquiryPayload(payload);
  if (!validation.success) {
    if (validation.isSpam) {
      return jsonResponse({ ok: true, reference: crypto.randomUUID() });
    }
    return jsonResponse(
      {
        ok: false,
        message: "Please check the highlighted fields and try again.",
        errors: validation.errors,
      },
      400,
    );
  }

  if (
    !env.ENQUIRY_EMAIL ||
    !normalizeEmailAddress(env.ENQUIRY_FROM_ADDRESS) ||
    !normalizeEmailAddress(env.ENQUIRY_TO_ADDRESS)
  ) {
    return jsonResponse({ ok: false, message: "Enquiries are being configured. Please try again later." }, 503);
  }

  const turnstile = await verifyTurnstile(validation.data.turnstileToken, request, env);
  if (turnstile === "misconfigured") {
    return jsonResponse({ ok: false, message: "Enquiries are being configured. Please try again later." }, 503);
  }
  if (turnstile === "unavailable") {
    return jsonResponse({ ok: false, message: "The security check is temporarily unavailable. Please try again." }, 503);
  }
  if (turnstile === "invalid") {
    const errors: EnquiryFieldErrors = { turnstile: "The security check expired or was not accepted. Please try it again." };
    return jsonResponse({ ok: false, message: "Please complete the security check again.", errors }, 400);
  }

  const reference = crypto.randomUUID();
  try {
    await env.ENQUIRY_EMAIL.send(createEmailPayload(validation.data, env, reference, new Date()));
  } catch (error) {
    console.error("Enquiry email delivery failed", {
      reference,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return jsonResponse({ ok: false, message: "Your enquiry could not be sent just now. Please try again shortly." }, 502);
  }

  return jsonResponse({ ok: true, reference }, 200);
}

const worker = {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    if (API_PATHS.has(new URL(request.url).pathname)) {
      return handleEnquiry(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

export default worker;
