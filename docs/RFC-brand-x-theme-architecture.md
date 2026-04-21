# RFC: Brand × Theme — Variable Architecture

**Status:** Open for discussion
**Dato:** 2026-04-22
**Forfatter:** John Kolvik, TRY Design
**Berørte parter:** TRY, Shortcut, REMA MarTech

---

## Problemet

Designsystemet har to uavhengige dimensjoner:

| Dimensjon | Collection | Modes |
|---|---|---|
| **Brand** | Primitives | DEFAULT, REMA, Uno X, Narvesen, Kolonihagen |
| **Tema** | Semantics | Light, Dark |

De fleste tokens varierer langs **én** dimensjon:
- `color/blue/500` varierer per brand (blå for REMA, teal for Uno X)
- `global/bg/primary` varierer per tema (hvit i Light, mørk i Dark)

Men noen tokens sitter i **krysset** mellom begge:

| Token | REMA Light | REMA Dark | Uno X Light | Uno X Dark |
|---|---|---|---|---|
| `global/text/on-brand` | hvit | hvit | **mørk** | **mørk** |
| `global/fg/on-brand` | hvit | hvit | **mørk** | **mørk** |
| `button/primary/text` | hvit | hvit | **mørk** | **mørk** |

Disse trenger å variere per **brand OG tema** — men ingen collection har begge dimensjonene.

### Hvorfor det er et problem i praksis

Uno X sin primærfarge er lys (gul/grønn). Hvit tekst på lys bakgrunn = uleselig. Vi oppdaget dette da vi testet brand-bytte på PromoSection — REMA og Narvesen fungerte, Uno X fikk hvit-på-gult WCAG-feil.

---

## Tre mulige løsninger

### A) "On-brand" i Primitives (anbefalt nå)

Legg kontrastfargen som en egenskap ved brand-fargen, i Primitives:

```
Primitives (modes: REMA | Uno X | Narvesen | Kolonihagen)
  color/brand/primary/500         → #023ea5 | #3bb25e | ...
  color/brand/primary/on-primary  → #ffffff | #171717 | #ffffff | #ffffff
```

Semantics aliaser dit uten å vite hvilket brand som er aktivt:
```
Semantics (modes: Light | Dark)
  global/text/on-brand → color/brand/primary/on-primary
```

**Slik gjør Material Design, Reshaped og andre det.** "On-primary" er en egenskap ved fargen, ikke en temabeslutning. Hvit tekst på REMA-blå er alltid hvit — uavhengig av Light/Dark.

| Fordel | Ulempe |
|---|---|
| Enklest å implementere | "Polutterer" Primitives med noe som føles semantisk |
| Fungerer i dag, ingen Enterprise-krav | Hvis on-brand trenger å variere mellom Light OG Dark per brand, trenger vi to variabler |
| Skalerer til N brands uten mode-eksplosjon | |
| Matcher industristandarder (Material, Reshaped) | |

### B) Flattede modes i Semantics

Kombiner brand og tema til én mode-dimensjon:

```
Semantics (modes: REMA-Light | REMA-Dark | UnoX-Light | UnoX-Dark | ...)
```

Full frihet — enhver token kan ha unikt verdi per kombinasjon.

| Fordel | Ulempe |
|---|---|
| Komplett fleksibilitet | 5 brands × 2 temaer = 10 modes (spiser mode-budsjettet) |
| Lett å forstå | Hver token må defineres for ALLE kombinasjoner |
| | Vedlikeholdsbyrde vokser eksponentielt |

**Slik gjør Shortcut det i dag** (REMA-Light, REMA-Dark, UnoX-Light, UnoX-Dark).

### C) Extended Collections på Semantics

Arv Semantics per brand, override kun avvikene:

```
Semantics (parent)              → Light, Dark → 85 variabler
  ↳ Semantics/REMA (extended)   → Light, Dark → arver alt, 0 overrides
  ↳ Semantics/Uno X (extended)  → Light, Dark → overrider 3-4 tokens
  ↳ Semantics/Narvesen          → Light, Dark → arver alt, 0 overrides
```

| Fordel | Ulempe |
|---|---|
| Reneste arkitektur — semantisk der det hører hjemme | Krever Enterprise (vi har det) |
| Kun avvik defineres — minimal vedlikehold | Kjent bug: default mode respekteres ikke alltid ved innsetting |
| Light/Dark per brand automatisk | Designer må velge to ting: Primitives-mode + Semantics-extension |
| Skalerer rent til N brands | Mer kompleks mental modell |

---

## Sammenligning

| Aspekt | A: Primitives | B: Flattede modes | C: Extended Collections |
|---|---|---|---|
| **Implementering** | Fungerer nå | Fungerer nå | Enterprise, kjent bug |
| **Modes brukt** | 5 (brand) + 2 (tema) = 7 | 10+ | 5 + 2 = 7 |
| **Vedlikehold** | Lavt | Høyt (N×M) | Lavt |
| **Arkitekturell renhet** | Medium | Lav | Høy |
| **Skalering** | God | Dårlig | Utmerket |
| **Industripraksis** | Material, Reshaped | Shortcut (nåværende) | Supernova anbefaler |
| **Designerkompleksitet** | Lav (1 mode-bytte) | Medium (1 mode-bytte) | Medium (2 valg) |

---

## Anbefaling

### Kort sikt (nå → medio mai): Pattern A

Implementer `color/brand/primary/on-primary` i Primitives. Det:
- Løser Uno X-kontrastproblemet umiddelbart
- Krever ingen nye Figma-features
- Matcher hvordan Material Design og Reshaped gjør det
- Er allerede implementert som workaround i POC-en

### Mellomlang sikt (juni → august): Evaluer Pattern C

Når Figma fikser mode-hierarchy-buggen i Extended Collections:
- Migrer de 3-4 "on-brand"-tokenene fra Primitives til Semantics-extensions
- Test med designerne — er den mentale modellen forståelig?
- Vurder om flere tokens trenger per-brand overrides

### Langsiktig (post-launch): Full Extended Collections

Når vi har 5+ brands og designteam på tvers:
- Extended Collections for både Primitives og Semantics
- Separate tilgangskontroll per brand
- Uavhengige oppdateringssykluser

---

## Tokens som trenger per-brand overrides

Basert på Uno X-testen er dette tokenene som trenger `on-brand`-varianter:

| Token | Standard (REMA, Narvesen, Kolonihagen) | Uno X override | Grunn |
|---|---|---|---|
| `global/text/on-brand` | hvit (#ffffff) | mørk (#171717) | Tekst på primærfarge |
| `global/fg/on-brand` | hvit | mørk | Ikoner på primærfarge |
| `button/primary/text` | hvit | mørk | Knappetekst |
| `badge/primary/text` | hvit | mørk | Badge-tekst |

Kun 4 tokens av 85 — noe som bekrefter at Pattern A er tilstrekkelig for nå.

---

## Referanser

- [Material Design — Color system](https://m3.material.io/styles/color/system) — definerer `on-primary` som del av fargeoppsettet
- [Reshaped — Color tokens](https://www.reshaped.so/docs/tokens/color) — automatisk `on-background-primary` basert på luminans
- [Figma — Extend a variable collection](https://help.figma.com/hc/en-us/articles/36346281624471-Extend-a-variable-collection)
- [Supernova — Extended Collections for multi-brand](https://www.supernova.io/blog/figma-extended-collections-multi-brand-design-systems)
- [Dave House — "A mode too far"](https://iknowdavehouse.medium.com/a-mode-too-far-28eaa822df65) — advarer mot mode-overbruk
- [Tokens Studio — permutateThemes](https://github.com/tokens-studio/sd-transforms) — code-side Brand × Theme løsning
- [Figma Forum — Extended Collections mode hierarchy issue](https://forum.figma.com/share-your-feedback-26/extended-collections-doesn-t-respect-mode-hierarchy-48123)
