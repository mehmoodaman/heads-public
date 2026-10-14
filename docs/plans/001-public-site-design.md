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
- [x] Owner review, approved publication and live HTTPS acceptance.

Release authorization: owner explicitly approved publishing the redesign and repairing live HTTPS on October 13, 2026.

Discoveries: live DNS matches GitHub Pages apex and www records. TLS verification fails with SEC_E_WRONG_PRINCIPAL for both domains. Pages reports https_enforced=false. Certificate provisioning must complete before HTTPS enforcement. Domain ownership is also unverified.

Validation: node --check public-site/build.mjs; node --check public-site/portal.js; node --test public-site/build.test.mjs public-site/portal.test.mjs. After approved deployment, check all five pages over HTTPS and the deletion flow on the intended Staging account. Real inbox/device/deletion acceptance is not established by local tests.

Outcomes: local design and all five automated tests passed. Approved redesign commit e892e95 deployed successfully through run 38493477273: https://github.com/mehmoodaman/heads-public/actions/runs/38493477273. Custom domain removal/re-addition restarted certificate issuance; certificate covers headsapp.co and www.headsapp.co and expires January 11, 2027. HTTPS enforcement enabled and read back. All five HTML pages and three assets return 200 over verified HTTPS with expected content. HTTP apex/www and HTTPS www redirect to https://headsapp.co/. No TLS checks bypassed, no account actions submitted. Safari/physical-iPhone review and real deletion acceptance remain manual and unverified. Domain ownership verification remains separate; no unrelated DNS records changed.



October 14, 2026 refinement: owner requested a darker live site, removal of the hero pickup slogan and footer basketball slogan, and minor improvements without a redesign. Warm charcoal surfaces, soft white text, orange accents, matching browser theme colors and narrow-screen navigation preserve the existing layout. Publication regression assertions cover removed copy. Both Node syntax checks and all five tests pass; desktop and 390px mobile previews inspected, with no horizontal overflow at 320/390/768/1440px. No portal behavior or policy wording changed. Publication requested for headsapp.co.
Refinement outcome: commit 1c9e6d0 published successfully through https://github.com/mehmoodaman/heads-public/actions/runs/38557594064. Live HTTPS homepage, privacy, terms, support, deletion and stylesheet return 200; homepage theme color and stylesheet contain the new charcoal palette, and both requested slogans are absent. Physical-iPhone/Safari review remains unverified.
