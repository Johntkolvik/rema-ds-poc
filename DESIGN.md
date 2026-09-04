# DESIGN.md — REMA 1000

Judgment layer for the REMA design system. Read this before generating any UI.

This file holds **only what the tokens cannot say**. It states no colour values, no
sizes, no spacing numbers. Where a value is needed, it names the token and stops.

> **Status: draft.** Sections marked **OPEN** carry a question that has not been
> decided by anyone with the authority to decide it. Do not treat an OPEN section
> as policy — it is a placeholder with a named owner.

---

## Where truth lives

| What | Source | Never |
|---|---|---|
| Colour, type, spacing, radius, elevation values | `src/app/tokens.generated.css` (931 properties, generated from Figma) | Restate a value in this file or in a component |
| Component structure and variants | Figma, mirrored in `src/components/*.tsx` | Hand-build a variant that exists in Figma |
| Component reference and states | Storybook (`npm run storybook`) | Guess at a state |
| Design ↔ code mapping | Code Connect (`src/components/*.figma.tsx`) | — |
| Copy and microcopy | CMS (Sanity) — **target state**, see [Content](#content) | Figma text boxes |

Regenerate values with `npm run tokens:export`. If a value in this file ever
contradicts `tokens.generated.css`, the token file wins and this file has a bug.

---

## The three parallel scales

This is the single most important section, and the reason this file exists.

The semantic layer carries four colour scales whose member names are nearly
identical. Several resolve to the **same underlying value**, so nothing in the
token system, and nothing visible in a rendered screen, tells you which one was
correct. Choosing by appearance produces a system that looks right and is wrong.

| Scale | Applies to | Example members |
|---|---|---|
| `--global-text-*` | Text glyphs only | `text-primary`, `text-brand`, `text-on-brand`, `text-placeholder` |
| `--global-fg-*` | Icons, glyph-like marks, borders drawn as content | `fg-primary`, `fg-brand`, `fg-on-brand` |
| `--global-bg-*` | Fills of interactive and stateful elements | `bg-primary`, `bg-brand-solid`, `bg-error-subtle` |
| `--global-surface-*` | Fills of containers that hold other content | `surface-default`, `surface-subtle`, `surface-elevated` |

**Rules**

- Text takes `text-*`. Never `fg-*`, even though `--global-text-brand` and
  `--global-fg-brand` resolve identically today. They are allowed to diverge, and
  when they do, every misuse becomes a visual bug at once.
- Icons take `fg-*`. An icon sitting inside a line of text still takes `fg-*`.
- A card, sheet, section or panel takes `surface-*`. A button, input, chip, badge
  or hover state takes `bg-*`.
- `*-on-brand` is only valid on top of a `*-brand-solid` fill. It is not a
  general-purpose light colour.

**Why this cannot be linted away:** `text-brand` and `fg-brand` are the same
value, so no contrast checker and no visual regression test can tell them apart.
This rule is enforced by review and by this file, or not at all.

---

## Choosing between valid siblings

Every scale offers several members that are syntactically valid anywhere. Tokens
say what exists; they cannot say when.

### Text emphasis

`text-primary` → `text-secondary` → `text-tertiary` → `text-quaternary` is a
descending emphasis ladder, not a palette. Use them in order. Skipping from
primary to quaternary to create contrast is how a screen loses its hierarchy.

### Brand colour on text

`--global-text-brand` is not a way to make something look important.

**OPEN** — needs a rule. The obvious candidates are price, campaign markers and
links. What is *not* in doubt: brand-coloured body copy is wrong, and more than
one brand-coloured element per card reads as decoration rather than signal.
→ *Owner: Anders / Ajit, via Design Sync.*

### Feedback colours

`error`, `warning` and `success` members exist in all four scales. They report
system state to the user. They are never used because red, amber or green looked
good. Brand is blue (`--color-brand-primary-*` aliases the blue ramp) and error
is red, so the two do not collide — but that also means red on a REMA surface
always reads as something being wrong.

### Disabled

`text-disabled`, `bg-disabled`, `border-disabled`, `fg-disabled` are a matched
set. Use all of them together, or the component reads as half-broken rather than
inactive.

---

## Responsive and platform sizing

Layout and sizing tokens carry modes, so the same token resolves differently per
breakpoint and per surface. Ask for the size you mean, and let the mode decide the
value.

- Ask for `lg`. Do not ask for a pixel value, and do not switch from `sm` to `lg`
  yourself at a breakpoint. `lg` is already larger on desktop, and larger again on
  a checkout screen.
- Web modes are SM → MD → LG → XL → 2XL, mapping 1:1 to CSS breakpoints.
- **Components contain zero media queries.** All responsive behaviour comes from
  custom properties changing at breakpoints. A media query inside a component is a
  bug, not a shortcut.
- `sm`/`md`/`lg` on a component means *relative* size within its surface, not an
  absolute one. A `lg` button on a POS terminal and a `lg` button in the app are
  both large and share no measurement.

---

## Never bind to the wrong layer

From `CLAUDE.md`, restated because agents violate these first:

1. Components bind to **semantics**, never to primitives. `--color-blue-500` in a
   component is always wrong; `--global-text-brand` is what you meant.
2. All variable bindings are local to the file. Never remote or library variables.
3. Brand-specific overrides live in Extended Collections, never in primitives.
4. No hardcoded values. If a value has no token, that is a gap to raise in Design
   Sync — not a licence to inline it.

---

## Anti-patterns

Named, because naming them is what makes them avoidable. Every one below is drawn
from something that actually shipped or actually broke.

### The absolute-value button

Setting a fixed width or height on a component that contains text. At maximum
phone zoom the text grows out of the box and becomes unreadable.

This shipped in the new login — roughly 300 hours of work — as a Vipps button
whose label overflowed on zoom, in white on a light background, invisible to
low-vision users. The cause was absolute values in code rather than tokens.

**Instead:** let the component size to its content. Tokens follow each other; a
fixed value does not.

### Strings in Figma

Copy written into Figma text boxes and then re-typed into code.

At the Spenn launch, bottom sheets across the flow carried "you earn on…" copy
written directly in Figma, in several variants depending on where in the flow the
user was. When the terms changed and car wash had to come out, every occurrence
had to be found in Figma, and then the developer did the identical job again in
code. Double work, and no guarantee the Figma text ever reached production.

**Instead:** strings come from the CMS. See [Content](#content).

### The stuffed home screen

Internal news and supplier-funded placements crowding out what the user came to
do. "A grocer won an award" is fine content and a poor home screen.

A restructured home screen tested well last year and lost to campaign placement.
The tension is real and commercial — but a generated screen should default to the
user's top tasks, not to internal announcements.

### Label drift

The same action labelled *Ferdig*, *Lukk* and *Avslutt* in different places.

**Instead:** one verb per action across the whole product. **OPEN** — the
canonical set is not decided. → *Owner: Karina.*

### Variant sprawl

Adding a component variant because an existing one is nearly right. Bottom sheet
variant count is an open question in Design Sync for exactly this reason, and
chip versus alert badge is unresolved.

**Instead:** use the closest existing variant, or raise the gap. Never generate a
new variant silently.

### Component-shaped decoration

Reaching for brand colour, elevation or a badge to make a screen feel designed.
Elevation reports depth. Badges report state. Brand colour reports brand. None of
them is available as ornament.

---

## Components

Built and mapped to Figma: `Button`, `Badge`, `ProductCard`, `ProductSection`,
`PromoSection`, `RecipeCard`. Check Storybook before building anything that
resembles one of these.

`Button` carries 72 variants across Style × Size × State × Shape. Almost any
button you need already exists.

Token groups exist for `card-{sm,md,lg}`, `pill-{sm,md,lg}`, `product-card`,
`promo-section`, `grid`, `section-gap`. A `pill-*` group exists without a `Pill`
component — **OPEN**, clarify whether pill tokens belong to `Badge` or to the
chips in `RecipeCard` before using them. → *Owner: Ajit.*

---

## Content

**Target state, not current state.** Today strings live in Figma and in code. The
direction is CMS-owned copy, consumed as JSON, exactly as tokens are.

- Copy, titles, button labels and microcopy are owned by content (Karina), not by
  design and not by whoever is building the screen.
- Legal text — terms, consent, privacy — is never authored by a designer or an
  agent. Reference it; do not write it.
- Design and content rules are documented separately. Visual and technical rules
  belong here; what a screen *says* does not.

When generating a screen, use realistic Norwegian copy as placeholder and mark it
as placeholder. Never present generated copy as approved.

---

## Tone

**OPEN** — REMA's tone of voice has not been written down in a form usable here.
What the material supports so far: the app is a place to act, not to read. Short
paths to an action. No article-length prose on a screen someone opened to check a
price.

→ *Owner: Karina, with Beate.*

---

## What is enforced elsewhere

Do not duplicate these here; they have teeth already.

| Check | Where |
|---|---|
| Accessibility (WCAG / UU) | `@storybook/addon-a11y`, axe-core, per story |
| Visual regression | Chromatic |
| Variable binding on publish | Figma — components cannot publish unbound |
| Token freshness | `npm run tokens:export`, then `grep 'undefined'` returns nothing |

A rule that can be checked should be a check, not a paragraph. This file is for
what no tool can see.

---

## Language

Structure and specification in English, matching the codebase and `CLAUDE.md`.
Copy examples in Norwegian, because the copy *is* Norwegian and translating the
examples would lose the thing being illustrated. Flip the whole file to Norwegian
if the team prefers — no structural reason not to.
