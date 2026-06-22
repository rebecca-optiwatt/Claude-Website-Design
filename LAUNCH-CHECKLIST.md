# Optiwatt Website — Launch Checklist

_Last updated: 2026-06-22_

## Decisions / done
- ✅ Stats verified (rewards $91.51, savings $13.03, 31,224 devices, 36 utilities, 44 programs, 4.8/3,100 ratings, 60,000+ users)
- ✅ Utility names: keep as plaintext (SCE, PSE&G, LADWP, ComEd, PSE, Clark Public Utilities, PNM)
- ✅ Rivian announcement publish date set to **2026-06-25** (meta, JSON-LD, sitemap)
- ✅ Leftover duplicate pages + orphaned CSS removed
- ✅ SEO foundation in place (canonical, Open Graph, Twitter, JSON-LD, robots.txt, sitemap.xml)
- ✅ Performance: inline images extracted, below-fold images lazy-loaded
- ⏳ Internal links stay `.html` until launch day, then convert to clean paths

## 🔴 Blockers — must be done before go-live
- [x] **Contact forms → HubSpot** (Utilities + Partners) — **connected and live-tested** against HubSpot form `ae6c580b-42c9-44a2-844f-27c3b6160cc1` (portal 8502002, na2). Both returned HTTP 200. Name split into first/last, Message required, partner-type folded into the message. _Delete the two test contacts (website-test-utilities@ / website-test-partners@example.com)._
- [ ] **Rivian page sign-off** — final Rivian approval on exec names, titles, quotes, and contact emails before it's public
- [ ] **Confirm permission to name partner utilities** publicly
- [x] **Legal pages content** — `privacy.html` (effective Nov 20, 2025) and `tos.html` (effective Mar 10, 2026) now hold the official copy in the site design; footer links point to them (same tab). _Recommend a final legal proofread of the rendered pages before launch._
- [ ] **Production hosting / DNS / HTTPS confirmed**, and assets deployed at `optiwatt.com/images/` (`og-image.jpg`, `logo-dark.webp`, `beyond-thermostat-dashboard.png`, `beyond-thermostat-front.png`)

## ⏱ Launch day (Wednesday) — do in order, just before deploy
1. [ ] Convert internal links from `.html` to clean paths (`consumers.html` → `/consumers`, etc.) across all pages
2. [ ] Configure server/rewrites so clean paths resolve; confirm zero broken internal links
3. [ ] Add **301 redirects** from current optiwatt.com URLs → new structure (preserve ranking equity)
4. [ ] Full smoke test: every nav link, footer link, CTA, store badge, login, signup, privacy, terms
5. [ ] Submit a test contact form → confirm it lands in HubSpot
6. [ ] Deploy
7. [ ] Verify HTTPS + www/non-www redirect resolves correctly

## 🟡 Strongly recommended before launch
- [ ] **Analytics** (GA4 / Google Tag Manager) installed; conversion tracking on form submits + app-store badge clicks
- [ ] **Cookie consent banner** — NOW APPLICABLE: the HubSpot tracking script is live and sets cookies (`__hstc`, `hubspotutk`, etc.). Enable a consent banner before launch (HubSpot has a built-in one under Settings → Privacy & Consent → Cookies, or use another CMP), especially for CA/EU visitors.
- [ ] **"View case studies"** — relabel or build a real page (today it jumps to the stats section)
- [ ] **Lighthouse / PageSpeed pass**; add `width`/`height` to images to prevent layout shift; consider WebP for the PNG mockups
- [ ] **Cross-browser + real-device QA** (iOS Safari, Android Chrome, desktop Chrome/Safari/Firefox/Edge)
- [ ] **Final copy proofread + leadership sign-off** on all pages
- [ ] Add `404.html` and `site.webmanifest`

## 🟢 Launch day & post-launch
- [ ] **Google Search Console**: verify domain, submit `sitemap.xml`, request indexing
- [ ] **Bing Webmaster Tools**: verify + submit sitemap
- [ ] **Google Rich Results Test** on live URLs (Organization, SoftwareApplication, FAQ, NewsArticle)
- [ ] Monitor form submissions, analytics, and Search Console crawl errors for the first week

## HubSpot form integration — what we need
Recommended approach: keep our custom-designed form and submit to HubSpot's public **Forms Submission API** (no API key/secret, safe for a static site).

To wire it up, provide:
1. **HubSpot Portal/Hub ID** (Settings → Account Defaults, or any embed snippet)
2. A **form created in HubSpot** → its **Form GUID**
3. **Region / data center** (`na1`, `na2`, or `eu1`)
4. **Field mapping** — current fields are Name, Company, Work email, Message → confirm matching HubSpot contact properties (email is required)
5. Whether to also install the **HubSpot tracking script** sitewide (improves lead attribution; partially covers the analytics item)
