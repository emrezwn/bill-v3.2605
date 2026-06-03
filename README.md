# Bill v3 Prototype

### Run locally
1. `npm i`
2. `npm run dev`

### Pages
- `bill-v1.html` / `bill-v2.html` / `bill-v3.html` — payment method selection (layout variants)
- `bill-invoice.html` — invoice payment
- `bill-card.html` — card payment form
- `bill-qr.html` — QR code payment
- `receipt.html` — success receipt
- `receipt-failed.html` / `receipt-pending.html` — failure/pending states
- `receipt-einvoice.html` / `receipt-einvoice-v1.html` — e-invoice receipts

### CSS
- `variables.css` — design tokens (colors, spacing)
- `style.css` — layout, typography, components
- `payment-method.css` — payment selection UI, payment forms, QR, e-invoice, campaign
- `normalize.css` — browser resets
- `responsive.css` — breakpoints

### JS
- `script.js` — payer details accordion (all pages)
- `payment-method.js` — payment method selection, accordion, processing animation
- `card-validation.js` — card form validation and formatting
- `qr-timer.js` — QR expiry countdown
- `accountType.js` — B2C/B2B bank list filtering

### Backend integration notes
- All payment processing is simulated — replace `simulateProcessing()` with real gateway calls
- Card validation is client-side only — implement server-side validation
- Forms have no submission endpoints — add CSRF-protected form handlers
- If using Turbo (Rails), replace `DOMContentLoaded` with `turbo:load` in all JS files
- Asset paths are relative — adapt to your asset pipeline
