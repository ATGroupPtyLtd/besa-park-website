# BESA Park — website source

This is the editable BESA Park website. It exports the frontend as static files and uses a small Cloudflare Worker for the protected enquiry endpoint.

## Local website preview

1. Install Node.js 22 or newer.
2. Run `npm install`.
3. Run `npm run dev` and open the local address shown.

To preview the full Cloudflare build, including a simulated email submission:

1. Copy `.env.example` to `.env.local`.
2. Copy `.dev.vars.example` to `.dev.vars`.
3. Run `npm run preview` and open the Wrangler address shown.

The Cloudflare test keys work only for development. Local email delivery is simulated: Wrangler logs the message and saves its HTML and text without sending a real email.

## Enquiry security

The form includes matching browser and server validation, current international phone metadata, Cloudflare Turnstile server verification, per-visitor and global rate limits, exact same-origin enforcement, a bot honeypot, strict request/content limits, HTML escaping, fixed sender/recipient bindings, safe reply-to handling, generic public errors, no user-data logging, and restrictive browser security headers. Turnstile tokens are checked for their expected action and hostname and are single-use.
