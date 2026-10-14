# 001 — Public site design

Purpose: make the existing GitHub Pages landing, legal, support and deletion pages feel like Heads, with a clear mobile layout.

Scope: app palette and reusable CSS tokens, responsive landing page, court illustration, working navigation and consistent document/form styling. The static builder publishes the homepage alongside the existing pages.

Non-goals: app changes, legal-policy rewrites, account/API changes, analytics, dependencies, automatic deployment, or unrelated domain changes.

Security/privacy: retain portal IDs, CSP, in-memory sessions and existing authorization behavior. Illustration headcounts are explicitly examples. No external fonts/scripts or tracking.

Progress:
- [x] Read existing app tokens, site builder and portal tests.
- [x] Build responsive landing and shared document styling.
- [x] Include homepage in builder and test navigation/publication.
- [x] Run Node syntax checks and all five public-site tests.
- [x] Inspect desktop and 390px mobile screenshots; verify no horizontal overflow at 320, 390, 768 and 1440px.
- [ ] Owner review, approved publication and live HTTPS acceptance.

Release authorization: owner explicitly approved publishing the redesign and repairing live HTTPS on October 13, 2026.

Discoveries: live DNS matches GitHub Pages apex and www records. TLS verification fails with SEC_E_WRONG_PRINCIPAL for both domains. Pages reports https_enforced=false. Certificate provisioning must complete before HTTPS enforcement. Domain ownership is also unverified.

Validation: node --check public-site/build.mjs; node --check public-site/portal.js; node --test public-site/build.test.mjs public-site/portal.test.mjs. After approved deployment, check all five pages over HTTPS and the deletion flow on the intended Staging account. Real inbox/device/deletion acceptance is not established by local tests.

Outcomes: local design and automated acceptance passed. Remote publication, certificate repair, Safari/physical-iPhone review and real deletion acceptance remain pending. No live settings changed.

