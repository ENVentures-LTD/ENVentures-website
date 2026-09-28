# ENVentures LTD Website

Static company website for ENVentures LTD, designed for GitHub Pages.

## Launch details

- Domain: `enventures.co.uk`
- Company number: `17320629`
- Registered office: `11 Anchor Way, Stafford, United Kingdom, ST20 0JE`
- Registered in: England and Wales
- Fameally URL: <https://fameally.com/>
- Contact email: `contact@enventures.co.uk`

## Site structure

- `index.html`: company homepage
- `about.html`: company profile and registered details
- `products.html`: products page, including Fameally
- `contact.html`: email contact page
- `google*.html`: Google Search Console verification files

## Contact form

The contact page uses a zero-cost `mailto:` form. It opens the visitor's email client with a prefilled message instead of submitting data to a backend.

The contact page uses the shared mailbox `contact@enventures.co.uk`.

- `contact.html`
- `assets/contact.js` fallback recipient
- `privacy.html`
- `cookies.html`

## GitHub Pages deployment

This site has no build step. Publish the repository with GitHub Pages using the root directory of the default branch.

The `CNAME` file sets the custom domain to `enventures.co.uk`. Configure DNS with your domain provider according to GitHub Pages' current instructions.

If the live site appears stale, check the GitHub Actions `pages build and deployment` run for the latest commit.

## Search Console Verification

The `google*.html` files prove ownership of `enventures.co.uk` in Google Search Console. They must remain available at the site root unless the domain is verified another way.

## IndexNow

The root file `c13d6ef208f342b5be62f1004fc88f42.txt` verifies the site for IndexNow. Keep it publicly accessible at the same path. This hosted verification key does not require a GitHub secret or a separate Bing registration.

After a successful `pages-build-deployment` workflow on `main`, the `Submit URLs to IndexNow` action verifies the live key and submits the URLs from the live sitemap to `https://api.indexnow.org/indexnow`. It can also be run manually from GitHub Actions on `main`. If the deployment workflow is renamed, update the trigger in `.github/workflows/indexnow.yml`.

Local validation (no submission): `python scripts/submit-indexnow.py --dry-run`.

After deployment, submit manually with `python scripts/submit-indexnow.py`. HTTP 200 means received; HTTP 202 means received with key validation pending. Neither guarantees indexing. Failed requests fail the action; resolve the reported issue before rerunning it. Keep `sitemap.xml` up to date when adding pages. Removed URLs are no longer in the sitemap and must be submitted separately if a deletion notification is needed.

Protocol reference: <https://www.indexnow.org/documentation>.

## Legal note

GOV.UK says UK limited company websites should show the company number, registered office address, where the company is registered, and the fact that it is a limited company. This site includes those details in the footer and company pages.

## Product pages and checks

Fameally's company/product page is `/products/fameally.html`. Keep household advice and search-focused meal planning content on Fameally; company stories belong here. Social links are deferred until official URLs are confirmed. Do not add Fameally profiles to the company Organization's sameAs or global footer.

Run `node scripts/validate-site.mjs` before publication. The validator covers the seven content pages and deliberately excludes the Google ownership-verification file. Preview with `python -m http.server 8767 --bind 127.0.0.1`. Check home, products, Fameally and contact with keyboard navigation, 200% zoom and a narrow viewport.

The application ID is `https://fameally.com/#app`; its publisher and creator are `https://enventures.co.uk/#organization`. Keep the app data consistent with Fameally's homepage. The company image is a locally hosted 1200 × 630 PNG; its SVG source is in assets.

Review locally before pushing to the publishing branch: this site's branch-based Pages deployment can publish a push. Release the company entity/product changes before the companion Fameally changes, then verify both cross-site links. Keep the previous revision for rollback. Website changes do not authorize changes to store listings or social accounts.
