import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";

const root = process.argv[2] ? resolve(process.argv[2]) : resolve(import.meta.dirname, "..");
const origin = "https://enventures.co.uk";
// Search Console verification HTML is not a content page.
const pages = ["index.html", "about.html", "products.html", "contact.html", "privacy.html", "cookies.html", "products/fameally.html"];
const failures = [];
const unique = { title: new Set(), description: new Set(), canonical: new Set() };
const attr = (tag, key) => tag.match(new RegExp(`\\b${key}="([^"]*)"`, "i"))?.[1];
const expectedUrls = pages.map((page) => `${origin}/${page === "index.html" ? "" : page}`);
for (const [index, page] of pages.entries()) {
    const file = join(root, page);
    const html = readFileSync(file, "utf8");
    const fail = (message) => failures.push(`${page}: ${message}`);
    const tags = [...html.matchAll(/<(?:meta|link|a|img|script)\b[^>]*>/gi)].map((m) => m[0]);
    const meta = (key) => attr(tags.find((tag) => attr(tag, "property") === key || attr(tag, "name") === key) ?? "", "content");
    const canonical = attr(tags.find((tag) => attr(tag, "rel") === "canonical") ?? "", "href");
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    for (const [key, value] of Object.entries({ title, description: meta("description"), canonical })) {
        if (!value || unique[key].has(value)) fail(`missing or duplicate ${key}`);
        unique[key].add(value);
    }
    if (canonical !== expectedUrls[index] || meta("og:url") !== canonical) fail("canonical or sharing URL mismatch");
    if (meta("og:title") !== title || meta("twitter:title") !== title || meta("og:description") !== meta("description") || meta("twitter:description") !== meta("description")) fail("sharing text does not match page metadata");
    for (const key of ["og:type", "og:image", "og:image:alt", "og:image:width", "og:image:height", "twitter:card", "twitter:image"]) {
        if (!meta(key)) fail(`missing ${key}`);
    }
    for (const key of ["og:image", "twitter:image"]) {
        const url = new URL(meta(key) ?? "/missing", origin);
        if (url.origin !== origin || !existsSync(join(root, url.pathname))) fail(`missing local ${key}`);
    }
    if (meta("robots")?.includes("noindex")) fail("content page must be indexable");
    if ((html.match(/<h1\b/gi) ?? []).length !== 1) fail("expected one H1");
    if (!html.includes('lang="en-GB"') || !html.includes('href="#main"') || !html.includes('<main id="main">')) fail("missing language or skip navigation");
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    if (new Set(ids).size !== ids.length) fail("duplicate element IDs");
    for (const tag of tags) {
        if (tag.startsWith("<img") && ["alt", "width", "height"].some((key) => attr(tag, key) === undefined)) fail("image lacks alt or dimensions");
        const value = attr(tag, "href") ?? attr(tag, "src");
        if (!value || /^(https?:|mailto:|tel:|data:)/i.test(value)) continue;
        const [pathname, fragment] = value.split("#");
        const path = pathname.split("?")[0];
        let target = path ? resolve(path.startsWith("/") ? root : dirname(file), path.startsWith("/") ? "." + path : path) : file;
        if (relative(root, target).startsWith("..") || !existsSync(target)) { fail(`broken local link: ${value}`); continue; }
        if (statSync(target).isDirectory()) target = join(target, "index.html");
        if (!existsSync(target)) { fail(`missing directory index: ${value}`); continue; }
        if (fragment && target.endsWith(".html") && !readFileSync(target, "utf8").includes(`id="${decodeURIComponent(fragment)}"`)) fail(`broken fragment: ${value}`);
    }
    const nodes = [];
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try { const json = JSON.parse(match[1]); nodes.push(...(json["@graph"] ?? [json])); }
        catch { fail("invalid JSON-LD"); }
    }
    const company = nodes.filter((node) => node["@type"] === "Organization");
    if (company.length !== 1 || company[0]?.["@id"] !== `${origin}/#organization` || company[0]?.name !== "ENVentures LTD" || company[0]?.legalName !== "ENVentures LTD" || company[0]?.url !== `${origin}/`) fail("inconsistent company entity");
    if (page === "products/fameally.html") {
        const app = nodes.find((node) => node["@type"] === "SoftwareApplication");
        if (app?.["@id"] !== "https://fameally.com/#app" || app?.publisher?.["@id"] !== company[0]?.["@id"] || app?.creator?.["@id"] !== company[0]?.["@id"] || app?.installUrl?.length !== 2) fail("inconsistent Fameally entity");
        const webPage = nodes.find((node) => node["@type"] === "WebPage");
        if (webPage?.url !== canonical || webPage?.mainEntity?.["@id"] !== app?.["@id"]) fail("product page entity mismatch");
        if (nodes.find((node) => node["@type"] === "BreadcrumbList")?.itemListElement?.at(-1)?.item !== canonical) fail("breadcrumb mismatch");
    }
}
const sitemap = [...readFileSync(join(root, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (new Set(sitemap).size !== sitemap.length || sitemap.length !== expectedUrls.length || expectedUrls.some((url) => !sitemap.includes(url))) failures.push("sitemap: expected exactly the public content pages");
if (!readFileSync(join(root, "robots.txt"), "utf8").includes(`Sitemap: ${origin}/sitemap.xml`)) failures.push("robots.txt: missing sitemap declaration");
const image = readFileSync(join(root, "assets/enventures-social.png"));
if (image.readUInt32BE(16) !== 1200 || image.readUInt32BE(20) !== 630) failures.push("sharing image must be 1200 × 630");
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log(`Validated ${pages.length} company pages: metadata, entities, links, accessibility attributes, sharing image and sitemap.`);
