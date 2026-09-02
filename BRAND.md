# Brand implementation notes

How the printed identity in *Manual de identidad — May & May Law Firm* is
carried into this website, and where to change it.

## Colour

The manual specifies four colours. All four are used, and nothing outside
this family appears anywhere on the site.

| Manual | Hex | Token | Where it appears |
|---|---|---|---|
| Burgundy | `#702732` | `--c-burgundy-700` | Hero and masthead grounds, headings, primary buttons, the wordmark |
| Crimson | `#A3222F` | `--c-crimson-500` | The logo ampersand, "LAW FIRM", accent buttons, rules, eyebrow labels |
| Stone | `#EFEBE6` | `--c-stone-200` | Alternating section grounds, payment callout, credential pills |
| Cream | `#FCF7F2` | `--c-cream` | The page ground, and reversed-out text on burgundy |

Interfaces need a few values a print palette does not: a hover shade, a
hairline, a body-copy grey. Every one of those in `assets/css/brand.css` is a
tint or shade of the four above, and each is commented as such.

Two **role tokens** sit on top of the palette:

- `--c-accent-text` — accent *text* (eyebrow labels, numerals, small marks)
- `--c-link` — inline links

Dark sections re-point just those two to the light crimson tint
`--c-crimson-200`, which is why the accent *fills* stay true crimson on a
burgundy ground while the accent *text* stays readable. Change them in the
one block in `site.css` marked "Dark grounds re-point the muted/accent
tokens".

All text on the site clears WCAG AA contrast (4.5:1 for body, 3:1 for large
headings) on every ground it appears on, in both languages.

**The one deliberate exception to the palette** is the WhatsApp bubble, which
uses WhatsApp's own `#25D366`. A third-party affordance is recognised by its
platform colour, and losing that recognition costs more than the consistency
gains; the manual's palette rule is about the firm's own mark, which the
bubble does not carry. Its text is the brand's dark ink, which also keeps it
at 8:1.

## Typography

The manual names Garet, Slate Pro and Californian FB. None is licensed for
web delivery, so each is substituted with its closest open equivalent:

| Manual | Substitute | Token | Role |
|---|---|---|---|
| Garet regular | **Jost** | `--font-display` | Headings, the wordmark, letterspaced caps |
| Slate Pro | **Source Sans 3** | `--font-sans` | Body copy and interface |
| Californian FB | **Sorts Mill Goudy** | `--font-serif` | The tagline and editorial accents |

Sorts Mill Goudy is drawn from Goudy's Californian, so it is a close relative
rather than a lookalike. The fonts are self-hosted in `assets/fonts/` — no
third-party font CDN, so nothing about a visitor is disclosed to another
company and the pages still set correctly if an outside host is unreachable.

**If the firm licenses Garet, Slate Pro or Californian FB for web use:** drop
the `.woff2` files into `assets/fonts/`, add matching `@font-face` rules to
`assets/fonts/fonts.css`, and put the real family names first in the three
stacks in `brand.css`. Nothing else has to change.

## Logo

`assets/img/logo-mark.svg` is the isotipo, traced from the brand asset
supplied with the manual — real vector outlines, not a bitmap, so it stays
sharp at any size and in print.

| File | Use |
|---|---|
| `logo-mark.svg` | Isotipo in burgundy, for light grounds (site header) |
| `logo-mark-invert.svg` | Isotipo in cream, for burgundy grounds (footer) |
| `logo-mark-crimson.svg` | Isotipo in crimson, for stone or cream grounds |
| `logo-lockup.svg` | Full isologotipo, self-contained — email signatures, directories, print |
| `mark-watermark.svg` | The isotipo at 3% opacity, the watermark treatment used on the business card |
| `favicon.svg` | Isotipo reversed out of burgundy, square |

The header and footer wordmark is set live in HTML rather than as an image, so
it stays crisp at every size and reflows on small screens. It reproduces the
manual's lockup: MAY&MAY in the display face, the crimson calligraphic
ampersand with no space either side, and LAW FIRM letterspaced beneath in
crimson.

The manual's four prohibitions are observed throughout: the mark is never
recoloured outside the palette, never given a shadow or effect, never
rotated, and never placed over a busy image.

## Imagery

The manual asks for photography that connotes experience, commitment,
seriousness and humanity, in muted monochrome tones with palette accents.

This build ships **no photographs of people**. The two illustrations —
`doc-petition.svg` (a federal habeas corpus petition) and `doc-casefile.svg`
(a labour certification case file) — are document artwork drawn in the brand
palette. They carry no agency seal, form number or filled-in personal data,
so they read as illustration rather than as a reproduction of a real record.

If the firm later adds photography, follow the manual: muted monochrome,
palette accents, and only images the firm holds the rights to.
