# May & May Law Firm PLLC — website

A static, bilingual (English/Spanish) website. No build step, no framework, no
database: plain HTML, one stylesheet of design tokens, one stylesheet of
layout, and about 200 lines of JavaScript. Upload the folder to any host and
it works.

```
index.html             Home
firm.html              The Firm
attorneys.html         Attorneys and the senior paralegal team
practice-areas.html    All practice areas, each explained in full
detained.html          Immigration Detainee Representation
contact.html           Contact, enquiry form and the four offices
404.html               Not-found page
assets/css/brand.css   Colour, type and spacing tokens — the file to edit to re-skin
assets/css/site.css    Layout and components
assets/js/site.js      Language switch, mobile menu, reveals, form fallback
assets/fonts/          Self-hosted webfonts
assets/img/            Logo variants and the two document illustrations
BRAND.md               How the identity manual maps onto the site
```

## Before this goes live

Everything below is marked with a `TODO(May & May)` comment in the file named.
Search the pages for `TODO(May & May)` to find them all.

1. **The enquiry form has no endpoint.** `contact.html`'s `<form>` has
   `action="REPLACE_WITH_FORM_ENDPOINT"`. Until that is replaced, the form
   falls back to opening the visitor's email client with the answers filled
   in, so no enquiry is lost — but it is a poor experience. Replace the
   action with a form service (Formspree, Netlify Forms, Basin) or your
   host's own handler. The fields post as `name`, `phone`, `email`,
   `preferred_language`, `matter`, `office`, `detained`, `message`.
2. **Confirm the Bradenton postal code.** The letterhead reads
   `1201 Sixth Avenue West, Bradenton, Florida 32405`, transcribed here as
   written — but 32405 is a Panama City code and Bradenton uses 34205. It
   appears in the office card on `contact.html` and `index.html` and in the
   footer of every page.
3. **Fill out Bill May's biography.** His card on `attorneys.html` currently
   carries his role and his degrees only. Practice focus, bar admissions and
   years in practice are all worth adding. Keep the English and Spanish
   paragraphs in step.
4. **Add the paralegals' surnames.** The senior paralegals are listed by
   first name and firm address, as the letterhead lists them. Surnames, and
   a line of detail for each person, would make the section stronger.

Nothing on the site invents a credential, a case result, or a person. The
three achievements on the record band are stated qualitatively, as given, with
the "prior results do not guarantee a similar outcome" notice beside them and
in the footer of every page.

## Contact details, and where they come from

| Detail | Value | Source |
|---|---|---|
| Firm number — voice, SMS and WhatsApp | (727) 269-3797 | The firm |
| General email | info@maylaw-firm.com | The firm |
| Miami-Dade (principal) | 8200 NW 41st St., Suite 470, Doral, FL 33166 | Letterhead |
| Tampa Bay (by appointment) | 1201 Sixth Ave. W., Bradenton, FL 32405 | Letterhead — see item 2 above |
| Indiana (by appointment) | 3815 River Crossing Pkwy., Indianapolis, IN 46240 | Letterhead |
| Kentucky (by appointment) | 411 West Broadway, Frankfort, KY 40601 | Letterhead |

Two details on the letterhead are deliberately **not** published: Liam's
direct line (502-229-7806) and the second Miami line (305-675-6420). Only the
727 number appears anywhere on the site. To change any of this, search the
pages for `727`, for `maylaw-firm.com`, or for the street address.

The identity manual's business card carries an older Doral address —
2656 NW 97th Ave., 33172. The site uses the letterhead's 8200 NW 41st St.
If the older one is still current, that is the one to change.

## The WhatsApp bubble

A single fixed affordance in the bottom-right corner of every page, linking to
`https://wa.me/17272693797` — the same firm number, opened in WhatsApp. It
reads "Contact us on WhatsApp now!" in English and
"¡Contáctenos por WhatsApp ahora!" in Spanish, and the label stays visible at
every screen width.

It is drawn in the brand crimson rather than WhatsApp's own green, so it sits
inside the identity manual's palette; the WhatsApp glyph carries the
recognition. If you would rather have the familiar green, change `background`
in the `.whatsapp-bubble` rule in `assets/css/site.css` to `#25D366` and its
`color` to `#FFFFFF` — nothing else needs to move.

WhatsApp also appears in the "Reach us directly" card on `contact.html`.

## Editing the content

Every page is a standalone HTML file — open it, find the words, change the
words. There is no template to compile.

**Both languages live side by side in the markup:**

```html
<span data-l="en">Request a consultation</span>
<span data-l="es" lang="es">Solicitar una consulta</span>
```

CSS hides whichever language is not active, so the active element keeps its
natural layout and both languages are in the page for search engines to
index. When you add text, add both halves. If you only have English, copy the
English into the Spanish twin rather than leaving it out — a missing twin
shows as a gap when the visitor switches language.

Attributes cannot hold two spans, so `alt` and `aria-label` text is written
as `alt="English" data-alt-en="English" data-alt-es="Español"` and swapped by
`site.js`.

Language is chosen in this order: `?lang=es` in the URL, then the visitor's
previous choice, then the browser's own language, then English. The choice is
remembered in `localStorage`. With JavaScript switched off the site stays in
English and everything else still works.

## Changing the look

Edit `assets/css/brand.css`. Every colour, typeface and spacing step on the
site resolves back to a token in that one file. See `BRAND.md` for how the
tokens correspond to the identity manual, and what to do if the firm licenses
the real Garet, Slate Pro and Californian FB for web use.

## Payments

The "Make a Payment" button appears in the site header, in the mobile menu, in
the footer, and in a callout on the home, practice-areas, detained and contact
pages. All of them point at the firm's LawPay page:

`https://secure.lawpay.com/pages/maymaylawfirmpllc/immigration-payments-spanish`

To change it, search the pages for `secure.lawpay.com`.

## Deploying

Copy the whole folder to the web root. It is all static files.

- **Squarespace** does not host arbitrary HTML, so moving off it means
  pointing the domain somewhere else.
- **Netlify, Cloudflare Pages or Vercel** — connect this repository, leave the
  build command empty and set the publish directory to the repository root.
  All three serve `404.html` automatically.
- **GitHub Pages** — enable Pages on this branch. `.nojekyll` is already
  present so the asset folders are served as-is.
- **Traditional hosting** — upload by FTP. Point the 404 handler at
  `/404.html`.

Whichever host, serve it over HTTPS and keep `www.mayandmay-law.com` as the
canonical hostname — that is what the `<link rel="canonical">` tags,
`sitemap.xml` and `robots.txt` already declare. If the canonical host changes,
search for `www.mayandmay-law.com` and update it.

## Checks this build passes

- `npx html-validate *.html` — clean on all seven pages
- Every internal link and asset reference resolves
- No horizontal scrolling at 390px or 1440px, on any page, in either language
- Every text/background pair meets WCAG AA contrast
- The language switch, the mobile menu and the scroll reveals were exercised
  in a real browser on every page at both widths
