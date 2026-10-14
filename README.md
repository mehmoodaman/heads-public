# heads-public

Static Heads website hosted on GitHub Pages. The landing page and document/form styles use the mobile app's cream, ink and orange palette. No framework, external fonts or tracking are needed.

Run checks: `node --check public-site/build.mjs` and `node --test public-site/build.test.mjs public-site/portal.test.mjs`.

Generate with `node public-site/build.mjs` after setting the public configuration documented in [public-site/README.md](public-site/README.md). The builder includes `index.html`; publish only `public-site/dist`.

Publishing remains manual through the Publish Heads Website workflow and requires owner approval. Local source edits do not update the live site.

See [the design plan](docs/plans/001-public-site-design.md) for scope and acceptance.

HTTPS repair: in repository Settings → Pages, confirm `headsapp.co`. If certificate provisioning stays stuck after DNS is correct, remove and re-add the custom domain to restart provisioning (briefly disrupts domain routing; requires owner approval). Once the certificate covers `headsapp.co` and `www.headsapp.co`, enable Enforce HTTPS and verify HTTP redirects and all five HTTPS pages. Verify domain ownership separately under account Settings → Pages using GitHub's supplied TXT record; keep unrelated email/DNS records intact.

Reference: [GitHub HTTPS troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).
