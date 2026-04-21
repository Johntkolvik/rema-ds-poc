# PRD: TRY Design System — Figma → Code Pipeline (Intern)

**Status:** Proof of Concept (validert)
**Dato:** 2026-04-16
**Eier:** John Kolvik, TRY Design
**Figma:** [REMA Variable POC](https://www.figma.com/design/TPytjALjphlR0C6DJGvohU/REMA-Variable-POC--GitHub-)
**Demo:** [rema-ds-poc.vercel.app](https://rema-ds-poc.vercel.app)
**Repo:** [github.com/Johntkolvik/rema-ds-poc](https://github.com/Johntkolvik/rema-ds-poc)

---

## Problem

TRY bygger digitale løsninger for flere brands (REMA 1000, Uno X, Narvesen, Kolonihagen m.fl.). I dag:

1. **Figma og kode er to separate sannheter** — designere lager tokens i Figma, utviklere hardkoder verdier i CSS. Drift over tid er uunngåelig.
2. **Responsive oppførsel er manuell** — utviklere skriver media queries basert på designerens intensjon, ikke eksakte verdier.
3. **Multi-brand er copy-paste** — hvert brand har sin egen kodebase med dupliserte komponenter. Endringer må gjøres N ganger.
4. **Ingen automatisert pipeline** — designendringer krever manuell kode-oppdatering. Ingen kilde-til-sannhet.

## Visjon

**Én komponent, én sannhet, alle brands.**

## Arkitektur

### Token-kjeden (Figma → CSS)

```
Figma Primitives (per brand: REMA, Uno X, Narvesen...)
     ↓ aliaser
Figma Semantics (brand-agnostiske: --button-primary-background, --card-title)
     ↓ aliaser
Figma Component tokens (--card-padding, --button-sm-height)
     ↓ REST API eksport
tokens.generated.css (642 CSS custom properties)
     ↓ @import
Komponenter bruker kun var(--token) — null hardkodede verdier
```

### Responsive-kjeden

```
Figma Responsive collection (5 modes)
  SM (Mobile)         → :root (default, mobile-first)
  MD (Tablet)         → @media (width >= 640px)
  LG (Desktop Window) → @media (width >= 1024px)
  XL (Desktop)        → @media (width >= 1280px)
  2XL (Desktop Large)  → @media (width >= 1536px)
```

### Brand-kjeden

```
Primitives collection (5 modes):
  DEFAULT → fallback
  REMA    → #023ea5, #d71f2e
  Uno X   → Uno X palett
  Narvesen→ Narvesen palett
  Kolonihagen → Kolonihagen palett
```

## Hva POC-en har bevist

| Område | Status |
|---|---|
| Token-eksport fra Figma REST API | ✅ 642 variabler |
| Responsive tokens (5 breakpoints) | ✅ |
| Semantisk fargekjede | ✅ |
| Null media queries i komponenter | ✅ |
| Typografi-tokens | ✅ |
| Visuell Figma ↔ kode match | ✅ |
| Code Connect | ✅ |
| Custom font fra token | ✅ |
| Multi-brand bytte | ⚠️ Struktur klar, ikke testet i kode |
| Komponent-bibliotek | ⚠️ 4 av ~24 komponenter |

## Teknisk stack

| Lag | Teknologi |
|---|---|
| Design | Figma Variables, Code Connect, Responsive modes |
| Token-eksport | Node.js → Figma REST API |
| Frontend | Next.js 15 + Tailwind 4 |
| Tokens | CSS custom properties (generert) |
| Deploy | Vercel |

## Komponenter

### Tier 1: Primitiver
- ✅ Button (36 varianter: 4 styles × 3 sizes × 3 states + ikon-booleans)
- ✅ Badge (3 varianter: Primary/Danger/Subtle)
- ❌ Input
- ❌ PriceDisplay

### Tier 2: Kort
- ✅ RecipeCard (sm/md/lg) — Figma + kode + Code Connect
- ❌ RecipeCategoryCard, NewsCard, ArticleHighlightCard, ProductCard

### Tier 3: Seksjoner
- ✅ PromoSection — Figma + kode + Code Connect
- ❌ SectionWrapper, HeroBanner, TextHero, CtaBanner, SplitModule

### Tier 4: Spesial
- ❌ ContentCarousel, ProductCarousel, FaqSection, ArticleHero, HubHero

## Kjente begrensninger

1. ~~PromoSection har fill fra eksternt bibliotek (`Blue/10`)~~ — **Fikset.** Alle remote bindings rebundet til lokale variabler.
2. REMA-font er proprietær — må distribueres manuelt (løst med `public/fonts/`)
3. Figma Plugin API: FLOAT→TEXT binding støttes ikke, dype instanser kan feile
4. CSS alias-kjeder (4+ nivåer) er vanskelige å debugge

## Arkitekturproblem: Semantics × Brand — Extended Collections

### Problemet

Designsystemet har to uavhengige dimensjoner som trenger å variere:

| Dimensjon | Hvor den bor | Modes |
|---|---|---|
| **Brand** | Primitives | DEFAULT, REMA, Uno X, Narvesen, Kolonihagen |
| **Tema** | Semantics | Light, Dark |

Når en semantisk beslutning trenger å variere **per brand**, har vi ingen plass:
- Primitives har brand-modes men er for rå (fargeverdier, ikke kontekst)
- Semantics har Light/Dark men ingen brand-modes

**Konkret eksempel:** `global/text/on-brand` (tekst oppå brand-farge)
- REMA, Narvesen, Kolonihagen: hvit tekst (mørk primærfarge)
- Uno X: mørk tekst (lys primærfarge)

Denne beslutningen er semantisk ("hva er lesbart oppå brand-fargen?") men trenger brand-kontekst. I dag sin struktur kan den ikke uttrykkes rent.

### Workaround (nåværende)

Opprettet `color/brand/on-primary` i Primitives som varierer per brand, og peker Semantics dit:
```
Semantics: global/text/on-brand → Primitives: color/brand/on-primary
                                      REMA: #ffffff (hvit)
                                      Uno X: #171717 (mørk)
```
Fungerer, men "polutterer" Primitives med semantiske beslutninger.

### Løsning: Extended Collections (Figma Enterprise)

Extended Collections lar oss arve Semantics og bare override det som er annerledes per brand:

```
Semantics (base)              → Light, Dark → 85 variabler
  ↳ Semantics/REMA (extended) → Light, Dark → arver alt, overrider 0
  ↳ Semantics/Uno X (extended)→ Light, Dark → overrider kun text/on-brand → mørk
  ↳ Semantics/Narvesen        → Light, Dark → arver alt, overrider 0
```

**Fordeler:**
- Semantiske beslutninger forblir i Semantics (riktig lag)
- Kun avvik fra base trenger defineres (ikke 85 × N brands)
- Light/Dark fungerer per brand automatisk (Uno X Dark ≠ REMA Dark)
- Skalerer til N brands uten mode-eksplosjon

**Krav:** Figma Enterprise-plan (vi har det ✅)

**API:** `collection.extend(name)` eller `figma.variables.extendLibraryCollectionByKeyAsync(key, name)`

### Anbefaling

Implementer Extended Collections for Semantics som neste strukturelt arbeid. Dette løser:
1. `text/on-brand` per brand (Uno X-kontrast)
2. Fremtidige per-brand semantiske avvik (f.eks. Narvesen vil ha annen hover-farge)
3. Renere arkitektur — ingen semantiske verdier i Primitives

### Andre tokens som vil trenge per-brand overrides

| Token | Hvorfor |
|---|---|
| `global/text/on-brand` | Kontrastfarge varierer med brand-primærfarge |
| `global/bg/brand-subtle` | Noen brands vil ha nøytral bakgrunn, andre brandfarget |
| `button/primary/text` | Samme kontrast-issue som text/on-brand |
| `global/fg/on-brand` | Ikon-farge oppå brand-bakgrunn |

## Suksesskriterier

| Kriterie | Mål |
|---|---|
| Token-sync | < 60s |
| Visuell fidelitet | < 2px avvik |
| Brand-bytte | 1 variabel-endring |
| Ny komponent | < 2 timer |
| Code Connect | 100% dekning |

## Neste steg

1. Fullfør Tier 1 primitiver
2. Bygg Tier 2–3 komponenter
3. Nodes API pipeline (automatisk komponent-CSS)
4. CI/CD GitHub Action
5. Multi-brand test (Uno X)
6. Visuell regresjonstest
