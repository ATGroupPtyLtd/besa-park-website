import { parsePhoneNumberFromString } from "libphonenumber-js/max";

export const INTEREST_OPTIONS = {
  buy: "Buying a business space",
  lease: "Leasing a business space",
  operate: "Operating a business at BESA Park",
  hospitality: "Hospitality or lifestyle opportunity",
  invest: "Investment opportunity",
  other: "Something else",
} as const;

export type Interest = keyof typeof INTEREST_OPTIONS;

export const ENQUIRY_LIMITS = {
  name: 100,
  company: 120,
  email: 254,
  phone: 50,
  message: 2_000,
  turnstileToken: 2_048,
} as const;

export type EnquiryField =
  | "name"
  | "company"
  | "email"
  | "phone"
  | "interest"
  | "message"
  | "turnstile";

export type EnquiryFieldErrors = Partial<Record<EnquiryField, string>>;

export interface EnquiryData {
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: Interest;
  message: string;
  turnstileToken: string;
}

export type EnquiryValidationResult =
  | { success: true; data: EnquiryData; isSpam: false }
  | { success: false; errors: EnquiryFieldErrors; isSpam: boolean };

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f]/u;
const EMAIL_LOCAL_PART = /^[\p{L}\p{M}\p{N}!#$%&'*+\-/=?^_`{|}~.]+$/u;
const DOMAIN_CHARACTERS = /^[\p{L}\p{M}\p{N}.-]+$/u;
const HAS_LETTER = /\p{L}/u;
const HAS_LETTER_OR_NUMBER = /[\p{L}\p{N}]/u;

function readText(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFC").trim() : "";
}

function readSingleLine(value: unknown): string {
  return readText(value).replace(/[\t \u00a0]+/gu, " ");
}

function utf8Length(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

export function normalizeEmailAddress(value: unknown): string | null {
  const email = readText(value);

  if (
    !email ||
    utf8Length(email) > ENQUIRY_LIMITS.email ||
    CONTROL_CHARACTERS.test(email) ||
    /\s/u.test(email)
  ) {
    return null;
  }

  const atIndex = email.lastIndexOf("@");
  if (atIndex <= 0 || atIndex !== email.indexOf("@") || atIndex === email.length - 1) {
    return null;
  }

  const localPart = email.slice(0, atIndex);
  let domain = email.slice(atIndex + 1);

  if (
    utf8Length(localPart) > 64 ||
    !EMAIL_LOCAL_PART.test(localPart) ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..") ||
    !DOMAIN_CHARACTERS.test(domain)
  ) {
    return null;
  }

  domain = domain.replace(/\.$/u, "");

  let asciiDomain: string;
  try {
    asciiDomain = new URL(`https://${domain}`).hostname.toLowerCase();
  } catch {
    return null;
  }

  if (!asciiDomain.includes(".") || asciiDomain.length > 253 || asciiDomain.includes("..")) {
    return null;
  }

  const labels = asciiDomain.split(".");
  if (
    labels.some(
      (label) =>
        !label ||
        label.length > 63 ||
        label.startsWith("-") ||
        label.endsWith("-") ||
        !/^[a-z0-9-]+$/u.test(label),
    ) ||
    /^\d+$/u.test(labels.at(-1) ?? "")
  ) {
    return null;
  }

  return `${localPart}@${asciiDomain}`;
}

function normalizePhoneNumber(value: unknown): { value: string | null; reason?: "possible" | "valid" } {
  const suppliedPhone = readSingleLine(value);
  if (!suppliedPhone || suppliedPhone.length > ENQUIRY_LIMITS.phone || CONTROL_CHARACTERS.test(suppliedPhone)) {
    return { value: null, reason: "possible" };
  }

  // Australian local numbers are the common case; 00 is also accepted as an
  // international dialling prefix for visitors who paste a number that way.
  const parseablePhone = suppliedPhone.replace(/^00/u, "+");
  const phoneNumber = parsePhoneNumberFromString(parseablePhone, {
    defaultCountry: "AU",
    extract: false,
  });

  if (!phoneNumber?.isPossible()) {
    return { value: null, reason: "possible" };
  }

  if (!phoneNumber.isValid()) {
    return { value: null, reason: "valid" };
  }

  const formatted = suppliedPhone.startsWith("+") || suppliedPhone.startsWith("00")
    ? phoneNumber.formatInternational()
    : phoneNumber.formatNational();

  return { value: phoneNumber.ext ? `${formatted} ext. ${phoneNumber.ext}` : formatted };
}

export function validateEnquiryPayload(input: unknown): EnquiryValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, errors: {}, isSpam: false };
  }

  const values = input as Record<string, unknown>;
  if (readText(values.website)) {
    return { success: false, errors: {}, isSpam: true };
  }

  const errors: EnquiryFieldErrors = {};
  const name = readSingleLine(values.name);
  const company = readSingleLine(values.company);
  const email = normalizeEmailAddress(values.email);
  const phone = normalizePhoneNumber(values.phone);
  const interest = readText(values.interest);
  const message = readText(values.message).replace(/\r\n?/gu, "\n");
  const turnstileToken = readText(values.turnstileToken);

  if (!name) {
    errors.name = "Enter your full name.";
  } else if (name.length > ENQUIRY_LIMITS.name) {
    errors.name = `Keep your name to ${ENQUIRY_LIMITS.name} characters or fewer.`;
  } else if (CONTROL_CHARACTERS.test(name) || !HAS_LETTER.test(name)) {
    errors.name = "Enter a name using at least one letter.";
  }

  if (company) {
    if (company.length > ENQUIRY_LIMITS.company) {
      errors.company = `Keep the company name to ${ENQUIRY_LIMITS.company} characters or fewer.`;
    } else if (CONTROL_CHARACTERS.test(company) || !HAS_LETTER_OR_NUMBER.test(company)) {
      errors.company = "Enter a company name using letters or numbers.";
    }
  }

  if (!email) {
    errors.email = "Enter a complete email address, such as name@company.com.au.";
  }

  if (!readSingleLine(values.phone)) {
    errors.phone = "Enter your best contact number.";
  } else if (!phone.value && phone.reason === "possible") {
    errors.phone = "Enter the full number, including its area or country code where needed.";
  } else if (!phone.value) {
    errors.phone = "Enter a valid contact number.";
  }

  if (!(interest in INTEREST_OPTIONS)) {
    errors.interest = "Choose the opportunity you are interested in.";
  }

  if (!message) {
    errors.message = "Tell us briefly what you are looking for.";
  } else if (message.length < 10) {
    errors.message = "Please add a little more detail (at least 10 characters).";
  } else if (message.length > ENQUIRY_LIMITS.message) {
    errors.message = `Keep your message to ${ENQUIRY_LIMITS.message.toLocaleString("en-AU")} characters or fewer.`;
  } else if (CONTROL_CHARACTERS.test(message.replace(/\n/gu, ""))) {
    errors.message = "Remove unsupported control characters from your message.";
  }

  if (!turnstileToken || turnstileToken.length > ENQUIRY_LIMITS.turnstileToken) {
    errors.turnstile = "Please complete the security check.";
  }

  if (Object.keys(errors).length > 0 || !email || !phone.value || !(interest in INTEREST_OPTIONS)) {
    return { success: false, errors, isSpam: false };
  }

  return {
    success: true,
    isSpam: false,
    data: {
      name,
      company,
      email,
      phone: phone.value,
      interest: interest as Interest,
      message,
      turnstileToken,
    },
  };
}
