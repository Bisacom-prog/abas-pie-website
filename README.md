# Aba’s Pie — Single Page (CDN) with Live Stripe + Paystack Checkout

This repo preserves your single-page content and modernizes structure for fast deployment.

## Run locally
Open `index.html` directly, or use a local server:
- VS Code → Extensions → “Live Server” → Go Live

## Deploy
### Vercel (required for live payments)
- Import the repo
- Framework preset: **Other**
- Build command: **None**
- Output dir: `/`

Set env vars:
**Stripe**
- `STRIPE_SECRET_KEY`
- `STRIPE_SUCCESS_URL` = `https://YOUR_DOMAIN/success.html`
- `STRIPE_CANCEL_URL`  = `https://YOUR_DOMAIN/cancel.html`

**Paystack**
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CALLBACK_URL` = `https://YOUR_DOMAIN/success.html`

> Paystack: confirm your supported currencies. The demo uses `amount = total * 100` as smallest unit.

### GitHub Pages
Works for the site, but payments will not work (no `/api` serverless). Use Vercel for payments.

## Notes
- GA4 loads only after analytics consent. Set `window.ABASPIE_GA4_ID` in `index.html`.
- WhatsApp widget uses **+447555824637**.
- Replace placeholder images in `assets/img/` with real photos (keep filenames).

Last updated: 2025-12-23
