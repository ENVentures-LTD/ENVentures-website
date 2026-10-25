# ENVentures LTD Website

Corporate website for ENVentures LTD, with browser-side JavaScript interactions and static file delivery through GitHub Pages.

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
- `products.html`: concise product portfolio with links to product websites
- `products/fameally.html`: legacy URL redirect to Fameally's own website
- `contact.html`: email contact page
- `google*.html`: Google Search Console verification files

## Company contact

The contact page provides a direct `mailto:` link to `contact@enventures.co.uk`. It opens the visitor's email app; the address can also be copied into another email service. An optional email-copy button uses the Clipboard API and provides a selectable address if copying is unavailable. There is no contact form, JavaScript mail composer or enquiry backend. Product support is directed through the portfolio to the relevant product website.

Keep the mailbox consistent in `contact.html`, the shared footer, Organization structured data and `privacy.html`.

## GitHub Pages deployment

This site has no build step or server runtime. The interactive experience runs in the browser through `assets/site.js`; the existing GitHub Pages source and deployment workflow are unchanged. Publish the repository with GitHub Pages using the root directory of the default branch.

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

## Corporate content and checks

This is the corporate website for ENVentures LTD. The homepage explains the company's purpose and approach; About provides company information and registered details; Portfolio lists available products briefly and links to their own websites. Product features, pricing, tutorials, resources and release updates belong on each product's website. There is no company news section at present. Product concepts should not appear as available offerings.

Fameally has one brief portfolio entry at `/products.html#fameally`. The former detailed product page at `/products/fameally.html` is a zero-second HTML refresh redirect to `https://fameally.com/`, with a canonical destination and a visible fallback link. It is excluded from the sitemap. GitHub Pages does not provide repository-controlled server redirects. Do not add article content or duplicate app marketing to the compatibility page.

Run `node scripts/validate-site.mjs` before publication. The validator checks the six company content pages, company and page entities, portfolio entries, breadcrumbs, local links, accessibility attributes, metadata, the sharing image, sitemap and legacy redirect. The Google ownership-verification file is deliberately excluded from content-page checks.

Preview with `python -m http.server 8768 --bind 127.0.0.1`. Review home, About, Portfolio and Contact with keyboard navigation, 200% zoom and a narrow viewport. Local screenshots and review output belong in ignored `output/review/`.

The company entity remains `https://enventures.co.uk/#organization`. Its name, company number and registered office must agree with the visible company information. Product social profiles belong to the product; do not add them to the company entity or global footer. The company sharing image is a locally hosted 1200 x 630 PNG, with its matching SVG source in assets. The blue-and-mint design uses a locally hosted Inter variable font across headings, body text and controls. There are no live requests to an external font service. Keep `assets/fonts/Inter-LICENSE.txt` with the font. The WOFF2 was downloaded from the upstream [rsms/inter font files](https://github.com/rsms/inter/tree/master/docs/font-files) and verified against Git blob `5a8d3e72ad7ffb62af3b146e1b1f54ab5813a212`. The sharing SVG uses that same local font; render it as a standalone document when regenerating the PNG.

## Browser interactions

`assets/site.js` progressively enhances the existing HTML. The homepage approach tabs support click, Left/Right arrows, Home and End, with a single selected tab and its labelled panel. The mobile navigation opens with a button, closes with Escape, and resets correctly across the desktop breakpoint. Email copying reports success only after the Clipboard API resolves; unavailable or denied copying reveals a readonly field for manual selection. These interactions do not submit enquiries, fetch external data, store preferences or add analytics.

All company content, product links and email links remain available without JavaScript. The approach panels are readable in the source HTML; inactive panels are hidden only after the widget has initialised successfully. Pages keep ordinary browser navigation, with a short CSS entrance fade. No experimental cross-document transition API or JavaScript router is required. Section and panel motion respects `prefers-reduced-motion` and never leaves content hidden while waiting for a scroll event.

Checks: `node --check assets/site.js` and `node scripts/validate-site.mjs`. In the preview, verify tab selection and keyboard wrapping, mobile menu open/Escape/resize behaviour, email-copy success and manual fallback, and navigation at phone and desktop widths. Check the no-JavaScript layout and reduced-motion behaviour when those browser controls are available. No hosting migration, framework installation or build pipeline change is required.

References: [GitHub Pages hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [WAI tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText).

## Review and publication

Keep changes local until the user has reviewed and explicitly approved publication. A push to the publishing branch can publish this site automatically. Do not push, dispatch deployment workflows or submit indexing notifications before approval. Local validation and the IndexNow dry run do not publish or submit URLs.

After approval, publish the reviewed revision and check the corporate pages, cross-site product link, legacy redirect and sitemap. Preserve the Google verification file and public IndexNow key. Keep the previous revision available for rollback. Website changes do not authorize changes to store listings, social accounts or product websites.
