"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  ENQUIRY_LIMITS,
  INTEREST_OPTIONS,
  validateEnquiryPayload,
  type EnquiryField,
  type EnquiryFieldErrors,
} from "@/lib/enquiry";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface TurnstileOptions {
  sitekey: string;
  action: string;
  appearance: "interaction-only";
  size: "flexible";
  theme: "light";
  callback(token: string): void;
  "expired-callback"(): void;
  "error-callback"(): void;
}

declare global {
  interface Window {
    turnstile?: {
      render(container: HTMLElement, options: TurnstileOptions): string;
      remove(widgetId: string): void;
      reset(widgetId?: string): void;
    };
  }
}

interface ApiResponse {
  ok: boolean;
  reference?: string;
  message?: string;
  errors?: EnquiryFieldErrors;
}

function FieldError({ field, errors }: { field: EnquiryField; errors: EnquiryFieldErrors }) {
  const message = errors[field];
  if (!message) return null;
  return <span className="field-error" id={`${field}-error`}>{message}</span>;
}

function collectFormValues(form: HTMLFormElement, turnstileToken: string) {
  const formData = new FormData(form);
  return {
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    interest: formData.get("interest"),
    message: formData.get("message"),
    website: formData.get("website"),
    turnstileToken,
  };
}

export function EnquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [fieldErrors, setFieldErrors] = useState<EnquiryFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [formError, setFormError] = useState("");
  const [reference, setReference] = useState("");

  const setTurnstileError = useCallback((message: string) => {
    setTurnstileToken("");
    setFieldErrors((current) => ({ ...current, turnstile: message }));
  }, []);

  const renderTurnstile = useCallback(() => {
    if (!TURNSTILE_SITE_KEY || !window.turnstile || !turnstileContainerRef.current || widgetIdRef.current) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      action: "enquiry_submit",
      appearance: "interaction-only",
      size: "flexible",
      theme: "light",
      callback: (token) => {
        setTurnstileToken(token);
        setFieldErrors((current) => ({ ...current, turnstile: undefined }));
      },
      "expired-callback": () => setTurnstileError("The security check expired. Please complete it again."),
      "error-callback": () => setTurnstileError("The security check could not load. Please refresh the page and try again."),
    });
  }, [setTurnstileError]);

  useEffect(() => {
    renderTurnstile();
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderTurnstile]);

  function clearFieldError(field: EnquiryField) {
    if (!fieldErrors[field]) return;
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function resetTurnstile() {
    setTurnstileToken("");
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function submitEnquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setFormError("");
    const values = collectFormValues(event.currentTarget, turnstileToken);
    const validation = validateEnquiryPayload(values);

    if (!validation.success) {
      setFieldErrors(validation.errors);
      const firstInvalidField = Object.keys(validation.errors)[0] as EnquiryField | undefined;
      if (firstInvalidField === "turnstile") {
        turnstileContainerRef.current?.focus();
      } else if (firstInvalidField) {
        (event.currentTarget.elements.namedItem(firstInvalidField) as HTMLElement | null)?.focus();
      }
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "same-origin",
        signal: controller.signal,
      });
      const result = await response.json() as ApiResponse;

      if (!response.ok || !result.ok) {
        if (result.errors) setFieldErrors(result.errors);
        setFormError(result.message || "Your enquiry could not be sent. Please try again.");
        setStatus("idle");
        resetTurnstile();
        return;
      }

      setReference(result.reference || "");
      setStatus("sent");
      resetTurnstile();
    } catch (error) {
      setFormError(
        error instanceof DOMException && error.name === "AbortError"
          ? "Sending took too long. Please check your connection and try again."
          : "We could not reach the enquiry service. Please check your connection and try again.",
      );
      setStatus("idle");
      resetTurnstile();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function sendAnotherEnquiry() {
    formRef.current?.reset();
    setFieldErrors({});
    setFormError("");
    setReference("");
    setStatus("idle");
    resetTurnstile();
  }

  return (
    <div className="enquiry-panel">
      {TURNSTILE_SITE_KEY ? (
        <Script
          id="cloudflare-turnstile"
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      ) : null}

      {status === "sent" ? (
        <div className="form-success" role="status" aria-live="polite">
          <CheckCircle2 aria-hidden="true" />
          <p className="eyebrow">Interest registered</p>
          <h2>Thanks — your enquiry has been sent.</h2>
          <p>The BESA Park team has received your details and can follow up about the right opportunity.</p>
          {reference ? <p className="form-reference">Reference: {reference}</p> : null}
          <button className="button button-dark" type="button" onClick={sendAnotherEnquiry}>Send another enquiry</button>
        </div>
      ) : null}

      <form
        ref={formRef}
        className="enquiry-form"
        onSubmit={submitEnquiry}
        onChange={() => setFormError("")}
        noValidate
        hidden={status === "sent"}
        aria-label="Register your interest"
      >
        <div className="field-pair">
          <label htmlFor="name">
            Full name
            <Input
              required
              id="name"
              name="name"
              autoComplete="name"
              maxLength={ENQUIRY_LIMITS.name}
              placeholder="Your full name"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              onInput={() => clearFieldError("name")}
            />
            <FieldError field="name" errors={fieldErrors} />
          </label>
          <label htmlFor="company">
            <span className="label-heading">Company <span className="optional-label">Optional</span></span>
            <Input
              id="company"
              name="company"
              autoComplete="organization"
              maxLength={ENQUIRY_LIMITS.company}
              placeholder="Business name"
              aria-invalid={Boolean(fieldErrors.company)}
              aria-describedby={fieldErrors.company ? "company-error" : undefined}
              onInput={() => clearFieldError("company")}
            />
            <FieldError field="company" errors={fieldErrors} />
          </label>
        </div>

        <div className="field-pair">
          <label htmlFor="email">
            Email
            <Input
              required
              id="email"
              type="email"
              inputMode="email"
              name="email"
              autoComplete="email"
              maxLength={ENQUIRY_LIMITS.email}
              placeholder="you@company.com.au"
              spellCheck={false}
              autoCapitalize="none"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              onInput={() => clearFieldError("email")}
            />
            <FieldError field="email" errors={fieldErrors} />
          </label>
          <label htmlFor="phone">
            Phone
            <Input
              required
              id="phone"
              type="tel"
              inputMode="tel"
              name="phone"
              autoComplete="tel"
              maxLength={ENQUIRY_LIMITS.phone}
              placeholder="e.g. 0412 345 678 or +61…"
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "phone-error" : "phone-hint"}
              onInput={() => clearFieldError("phone")}
            />
            <span className="field-hint" id="phone-hint">Australian and international numbers are accepted.</span>
            <FieldError field="phone" errors={fieldErrors} />
          </label>
        </div>

        <label htmlFor="interest">
          I&apos;m interested in
          <NativeSelect
            required
            id="interest"
            name="interest"
            defaultValue=""
            className="form-select"
            aria-invalid={Boolean(fieldErrors.interest)}
            aria-describedby={fieldErrors.interest ? "interest-error" : undefined}
            onChange={() => clearFieldError("interest")}
          >
            <NativeSelectOption value="" disabled>Select an opportunity</NativeSelectOption>
            {Object.entries(INTEREST_OPTIONS).map(([value, label]) => (
              <NativeSelectOption value={value} key={value}>{label}</NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError field="interest" errors={fieldErrors} />
        </label>

        <label htmlFor="message">
          Tell us what you have in mind
          <Textarea
            required
            id="message"
            name="message"
            minLength={10}
            maxLength={ENQUIRY_LIMITS.message}
            placeholder="The space, timing or opportunity you’re looking for…"
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? "message-error" : "message-hint"}
            onInput={() => clearFieldError("message")}
          />
          <span className="field-hint" id="message-hint">Up to {ENQUIRY_LIMITS.message.toLocaleString("en-AU")} characters.</span>
          <FieldError field="message" errors={fieldErrors} />
        </label>

        <div className="form-trap" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="turnstile-field">
          <div
            ref={turnstileContainerRef}
            className="turnstile-widget"
            tabIndex={-1}
            aria-describedby={fieldErrors.turnstile ? "turnstile-error" : undefined}
          />
          {!TURNSTILE_SITE_KEY ? (
            <p className="form-notice form-notice-error" role="alert">
              <AlertCircle aria-hidden="true" />
              Secure enquiries are being configured. Please try again later.
            </p>
          ) : null}
          <FieldError field="turnstile" errors={fieldErrors} />
        </div>

        {formError ? (
          <p className="form-notice form-notice-error" role="alert">
            <AlertCircle aria-hidden="true" />
            {formError}
          </p>
        ) : null}

        <div className="form-bottom">
          <p><ShieldCheck aria-hidden="true" /> Your details are encrypted in transit and used only to respond to this enquiry.</p>
          <button
            className="button button-primary"
            type="submit"
            disabled={status === "submitting" || !TURNSTILE_SITE_KEY}
          >
            {status === "submitting" ? (
              <><LoaderCircle className="button-spinner" aria-hidden="true" /> Sending securely…</>
            ) : (
              <>Register interest <ArrowRight aria-hidden="true" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
