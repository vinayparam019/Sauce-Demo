# Sauce Demo Playwright Framework

Minimal Playwright + TypeScript starter for `https://sauce-demo.myshopify.com`.
It includes the Playwright configuration, shared UI base classes, fixtures, and one
Page Object Model for the customer login form. No test specs are included.

## Setup

```bash
npm ci
npx playwright install chromium
```

Copy `example.env` to `.env` and configure the local credentials there. `.env` is
ignored by Git; never commit real passwords.

## Login Page Object

The `loginPage` fixture exposes `navigate()`, `verifyFormVisible()`, and `signIn()`.
Shopify hCaptcha may block automated sign-in; use a dedicated test configuration if
automation of authenticated flows is needed.

Create specs under `tests/ui/` when ready, then run them with `npm test`.
