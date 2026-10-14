# Heads public legal artifact

`node public-site/build.mjs` produces the homepage, privacy, terms, support and deletion HTML plus three local assets in ignored `public-site/dist`. It does not copy repository documentation. `node --test public-site/build.test.mjs public-site/portal.test.mjs` verifies publication gating and the portal's auth/deletion/reconciliation flow.

Before publishing, the owner must confirm a monitored support address and operator identity, review policy wording against actual hosting/email/backups and launch jurisdictions, and configure these GitHub `public-site` environment variables:

- `HEADS_SUPPORT_EMAIL`: monitored email; never invented by the implementation.
- `HEADS_PUBLIC_OPERATOR`: responsible operator's public identity.
- `HEADS_PUBLIC_SITE_URL`: HTTPS directory (include the repository path for project Pages).
- `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the pilot backend and its public key only.
- `HEADS_SENTRY_RETENTION_DAYS`: omit when diagnostics are disabled; otherwise use confirmed retention of 1-90 days.

Configure Pages to deploy through GitHub Actions. The workflow is manual-only; set environment reviewers according to the owner's release policy. Trigger it only with explicit deployment authorization. No publication has been performed by this implementation.

Deploy migration 20261013001900 and `delete-account` on the intended backend. Set Edge secret `HEADS_PUBLIC_SITE_ORIGIN` to the site's exact HTTPS origin (no repository path). Standard Supabase server-only credentials stay in Edge. Asymmetric projects use the Auth JWKS; legacy HS256 projects require the server-only `SUPABASE_JWT_SECRET`. Never put that secret in a web/mobile public variable. `HEADS_AUTH_ISSUER` optionally specifies the exact expected issuer when internal routing differs; local smoke sets it to the known loopback Auth issuer. Keep SMTP templates showing the OTP token and confirm delivery to arbitrary pilot addresses. Configure any Auth CAPTCHA requirement before launch; the current portal has no CAPTCHA widget.

Set mobile `EXPO_PUBLIC_LEGAL_BASE_URL` to the published directory, and optional `EXPO_PUBLIC_SENTRY_DSN` to the owner's public project DSN. Diagnostic collection is still consent-gated. Native capture is deliberately off: all diagnostics cross the JavaScript sanitizer and gated transport. No replay, screenshot, view hierarchy, native offline cache, traces or identity is attached. Line numbers remain useful for locating JavaScript errors, but filenames, functions and error messages are redacted. This slice does not claim native crash reporting. Source maps are not uploaded by this slice; any future Sentry upload must use `SENTRY_AUTH_TOKEN` in EAS/GitHub secrets, never public config.

The portal uses same-origin scripts, a restrictive CSP, no remote SDK, no browser persistence, and no token-bearing URL. Sign-in uses `create_user:false`; deletion requests send the current session token and a fresh email OTP to the same app endpoint. Expired tokens leave the outcome uncertain; reauthenticate an existing account or contact support, never automatically recreate it.

Hosted acceptance: check all four URLs in signed-out browsers, real inbox delivery, CORS/preflight, app and portal deletion, repeated/lost responses, retention jobs and anonymization. Native acceptance: iOS/Android Account links, fresh OTP, tokens/caches/preferences/notification removal, storage failures and consent-revocation traffic. Synthetic local tests and JS exports do not pass those gates.
