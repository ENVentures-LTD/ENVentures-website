# ENVentures LTD Website

Static company website for ENVentures LTD, designed for GitHub Pages.

## Launch details

- Domain: `enventures.co.uk`
- Company number: `17320629`
- Registered office: `11 Anchor Way, Stafford, United Kingdom, ST20 0JE`
- Registered in: England and Wales
- Fameally URL: <https://www.fameally.com>
- Contact email: `contact@enventures.co.uk`

## Site structure

- `index.html`: company homepage
- `about.html`: company profile and registered details
- `products.html`: products page, including Fameally
- `fameally.html`: redirect to `products.html` for older links
- `contact.html`: email contact page

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

## Legal note

GOV.UK says UK limited company websites should show the company number, registered office address, where the company is registered, and the fact that it is a limited company. This site includes those details in the footer and company pages.
