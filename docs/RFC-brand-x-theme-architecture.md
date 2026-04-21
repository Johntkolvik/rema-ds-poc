# RFC: Brand × Theme — Variable Architecture

**Status:** Implemented and validated
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

## Validert: Extended Collections fungerer per node

Vi har testet Extended Collections i filen (Enterprise). Resultat:

- `Semantics.extend('Semantics/Uno X')` → opprettet uten feil
- Arver alle 114 variabler + Light/Dark modes automatisk
- Override: `global/text/on-brand` → `color/neutral/900` (mørk) i Uno X Light
- Applisert på en frame med `setExplicitVariableModeForCollection`
- **Resultat: Uno X-knappene fikk mørk tekst, REMA og Narvesen beholdt hvit**
- Alt side-by-side på samme canvas — fungerer som mode-bytte i layer-panelet

Extended Collections er **ikke** fil-nivå overrides — de kan velges **per node**, akkurat som modes. Dette eliminerer den antatte trade-off mellom side-by-side preview og arv.

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

### Kort sikt (nå → medio mai): Pattern A som POC-workaround

Implementer `color/brand/primary/on-primary` i Primitives for å løse de akutte kontrastproblemene (Uno X). Dette er en **workaround**, ikke målarkitekturen.

Akseptert gjeld: Semantiske beslutninger i Primitives. Fungerer for POC-formål.

### Produksjon (juni → august): Extended Collections er nødvendig

Når brands designes ordentlig, vil 30-40 av 85 semantiske tokens trenge per-brand overrides — ikke bare 4. Da holder ikke Pattern A fordi Primitives fylles med semantisk logikk som ikke hører hjemme der.

Extended Collections på Semantics er den **eneste skalerbare løsningen**:
- Migrer on-brand tokens fra Primitives til Semantics-extensions
- Design alle brand-avvik i riktig lag
- Valider at mode-hierarchy-buggen er fikset (eller workaround)
- Test den mentale modellen med designerne

**NB:** Extended Collections endrer arbeidsflyt — brands kan ikke lenger vises side-by-side i én fil. Design-fasen (POC, QA, sammenligning) bruker fortsatt modes. Produksjons-filer per brand bruker extensions.

### Anbefalt hybridmodell

```
POC / Design QA-fil:
  → Primitives med brand-modes (side-by-side sammenligning)
  → Semantics med Light/Dark
  → Pattern A workaround for on-brand tokens

Brand-spesifikke prosjektfiler (produksjon):
  → Publisert Primitives-library (uten modes — base values)
  → Extended Primitives per brand (overrider farger)
  → Publisert Semantics-library (Light/Dark)
  → Extended Semantics per brand (overrider 30-40 tokens)
```

Denne hybridmodellen lar oss beholde modes for design og preview, men bruke extensions for ren produksjonsarkitektur.

---

## Tokens som trenger per-brand overrides

Basert på Uno X-testen er dette tokenene som trenger `on-brand`-varianter:

| Token | Standard (REMA, Narvesen, Kolonihagen) | Uno X override | Grunn |
|---|---|---|---|
| `global/text/on-brand` | hvit (#ffffff) | mørk (#171717) | Tekst på primærfarge |
| `global/fg/on-brand` | hvit | mørk | Ikoner på primærfarge |
| `button/primary/text` | hvit | mørk | Knappetekst |
| `badge/primary/text` | hvit | mørk | Badge-tekst |

I POC-en er det kun 4 tokens som trenger overrides — men dette er fordi vi bare har testet én komponent med én problematisk brand. **I produksjon vil tallet være vesentlig høyere.** Når alle 85 semantiske tokens er ordentlig designet per brand, forventer vi 30-40+ overrides per brand: ulike hover-farger, feedback-farger, bakgrunnstoner, og visuell temperatur. Dette er et argument for at Extended Collections ikke er en "fin-å-ha" oppgradering, men en **nødvendighet** for produksjon.

---

## Referanser

- [Material Design — Color system](https://m3.material.io/styles/color/system) — definerer `on-primary` som del av fargeoppsettet
- [Reshaped — Color tokens](https://www.reshaped.so/docs/tokens/color) — automatisk `on-background-primary` basert på luminans
- [Figma — Extend a variable collection](https://help.figma.com/hc/en-us/articles/36346281624471-Extend-a-variable-collection)
- [Supernova — Extended Collections for multi-brand](https://www.supernova.io/blog/figma-extended-collections-multi-brand-design-systems)
- [Dave House — "A mode too far"](https://iknowdavehouse.medium.com/a-mode-too-far-28eaa822df65) — advarer mot mode-overbruk
- [Tokens Studio — permutateThemes](https://github.com/tokens-studio/sd-transforms) — code-side Brand × Theme løsning
- [Figma Forum — Extended Collections mode hierarchy issue](https://forum.figma.com/share-your-feedback-26/extended-collections-doesn-t-respect-mode-hierarchy-48123)
