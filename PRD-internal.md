# PRD: TRY Design System — Figma → Code Pipeline (Intern)

**Status:** POC validert (fase 1) → produksjonsmodning (fase 2, pågår)
**Sist oppdatert:** 2026-09-04
**Eier:** John Kolvik, TRY Design
**Figma:** [REMA.no Design System](https://www.figma.com/design/TPytjALjphlR0C6DJGvohU/) — samme filnøkkel som tidligere "REMA-Variable-POC", men filen ble 4. sept 2026 gjort om til TRYs løpende arbeidsfil for det faktiske rema.no-designsystemet. Ligger på TRYs Figma Enterprise-konto; plan om Shared Project for REMAs designere (se `TODO.md`).
**Demo:** [rema-ds-poc.vercel.app](https://rema-ds-poc.vercel.app)
**Repo:** [github.com/Johntkolvik/rema-ds-poc](https://github.com/Johntkolvik/rema-ds-poc)
**Relaterte dokumenter:** `CLAUDE.md` (teknisk regelverk + filstatus), `DESIGN.md` (dømmekraftlag for tokens), `TODO.md` (levende tiltaksliste knyttet til målene under), `docs/meeting-notes-2026-08-26.md`

---

## Problem

TRY bygger digitale løsninger for flere brands i Reitan-familien (REMA 1000, Uno-X, Kjeldsberg, 7-Eleven, Narvesen — og potensielt Reitan-konsernet selv som egen merkevare). I dag:

1. **Figma og kode er to separate sannheter** — designere lager tokens i Figma, utviklere hardkoder verdier i CSS. Drift over tid er uunngåelig.
2. **Responsive oppførsel er manuell** — utviklere skriver media queries basert på designerens intensjon, ikke eksakte verdier.
3. **Multi-brand er copy-paste** — hvert brand har sin egen kodebase med dupliserte komponenter. Endringer må gjøres N ganger.
4. **Ingen automatisert pipeline** — designendringer krever manuell kode-oppdatering. Ingen kilde-til-sannhet.

## Visjon

**Én komponent, én sannhet, alle brands.**

## Mål for denne fasen (avklart med Beate Gundersen, app-teamet REMA — sept 2026)

POC-en har bevist at mekanismen virker (se under). Det er ikke lenger spørsmålet.
Beate har satt tre føringer som nå definerer om prosjektet lykkes:

1. **Designsystemet skal eies av REMA** — ikke være avhengig av at TRY drifter det.
   I dag ligger arbeidsfilen på TRYs Figma Enterprise-konto (REMAs egen org er ikke
   Enterprise-tier ennå). Planlagt bro: Figma Shared Project, slik at REMAs
   designere jobber i filen med eget sete. Reell overføring er et eget spor —
   TRY er i dialog med Figma om å få Reitan-konsernet over på Enterprise.
2. **Vedlikeholdbart av flere designere — ikke avhengig av én person.** Krever et
   skrevet dømmekraftlag (se `DESIGN.md`) og en synk-prosess som ikke er avhengig av
   at én person husker å trigge den manuelt.
3. **Funksjonelt nok innen utgangen av november, senest midten av desember.** Dette
   er *ikke* bundet til rema.no-lanseringen 22. september — den fristen gjelder
   nettsiden, ikke designsystemet.

Se `TODO.md` for det løpende tiltaksarbeidet mot disse tre målene.

## Arkitektur

### Token-kjeden (Figma → CSS)

```
Figma Primitives (per brand: REMA, Uno-X, Kjeldsberg, 7-Eleven, Narvesen, [Reitan])
     ↓ aliaser
Figma Semantics (Light/Dark modes)
  ↳ Extended Collections per brand (Semantics/REMA, /Uno-X, /Narvesen, ...)
  ↳ Kun brand-spesifikke overrides — resten arves fra parent
     ↓ aliaser
Figma Responsive (SM → 2XL breakpoints + komponent-tokens)
     ↓ REST API eksport
tokens.generated.css (730 variabler → 2586 CSS custom properties inkl. dark mode,
etter restruktureringen av filen 4. sept 2026 — se CLAUDE.md)
     ↓ @import
Komponenter bruker kun var(--token) — null hardkodede verdier
```

> Brand-listen ovenfor er testdata for multi-brand-prinsippet (i filen i dag under
> plassholdernavn `Holzweiler`/`Kokkeløren`/`Bjørklund` — skal renames). `Reitan`
> som egen merkevare i systemet er foreslått, ikke bygget ennå.

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
Primitives collection (modes, oppdatert sept 2026):
  DEFAULT     → fallback
  REMA        → #023ea5, #d71f2e (brand = blå)
  Uno-X       → gul brand-primær (brand-alias peker på gult, ikke blått)
  Kjeldsberg  → Kjeldsberg-palett
  7-Eleven    → 7-Eleven-palett
  Narvesen    → Narvesen-palett
  [Reitan]    → foreslått lagt til — konsernets egen distinkte merkevare
```

Kolonihagen er tatt ut av brand-listen; erstattet av de faktiske Reitan-eide
kjedene (Uno-X, Kjeldsberg, 7-Eleven) i tillegg til Narvesen.

## Hva POC-en har bevist

| Område | Status |
|---|---|
| Token-eksport fra Figma REST API | ✅ 730 variabler → 2586 CSS-egenskaper (inkl. dark mode) |
| Responsive tokens (5 breakpoints) | ✅ |
| Semantisk fargekjede | ✅ |
| Null media queries i komponenter | ✅ |
| Typografi-tokens | ✅ |
| Visuell Figma ↔ kode match | ✅ |
| Code Connect | ✅ |
| Custom font fra token | ✅ |
| Dark mode | ✅ `@media (prefers-color-scheme: dark)` fra Semantics Dark mode |
| Extended Collections (multi-brand) | ✅ Validert — per-node switching, side-by-side |
| Multi-brand bytte i Figma | ✅ REMA/Uno X/Narvesen/Kolonihagen med korrekt kontrast |
| Komponent-bibliotek | ⚠️ 6 av ~24 komponenter |

## Teknisk stack

| Lag | Teknologi |
|---|---|
| Design | Figma Variables, Extended Collections, Code Connect, Responsive modes |
| Token-eksport | Node.js → Figma REST API |
| Frontend | Next.js 15 + Tailwind 4 |
| Tokens | CSS custom properties (generert) |
| Deploy | Vercel |

## Komponenter

### Tier 1: Primitiver
- ✅ Button (36 varianter: 4 styles × 3 sizes × 3 states + ikon-booleans) — matcher produksjon (`@rema/ui` har delt Button)
- ⚠️ Badge (3 varianter: Primary/Danger/Subtle) — **POC-only.** Ingen tilsvarende komponent i produksjon (verken kode eller Storybook). Holdes som demo av token-mekanikken, ikke en spec.
- ❌ Input
- ❌ PriceDisplay

### Tier 2: Kort
- ✅ RecipeCard (sm/md/lg) — Figma + kode + Code Connect, matcher produksjon
- ❌ RecipeCategoryCard, NewsCard, ArticleHighlightCard
- 🔜 **ProductCard** — bevisst utsatt, ikke droppet. Figma-filen markerer den
  "skal ikke utvikles" for *web-fasen* (rema.no-lansering 22. sept), og
  produksjonsmirroren har ingen `product-card`. Men: nå som **appen** blir en del
  av produktkort-arbeidet, blir dette et reelt to-do i en senere fase — ProductCard
  er et godt eksempel på en **multi-kanal-komponent** (web, app, evt. kasse) med
  ting som prisstruktur og prisvisning/-logikk som må holde seg konsistent på tvers
  av kanaler. Hold komponenten i denne POC-en som demo av mekanismen; ikke bygg den
  videre som spec før app-siden er avklart med eierne.

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

**Mot Beates tre mål (se `TODO.md` for oppdatert, prioritert liste):**
1. Avklar Figma Shared Project + Reitan/Enterprise-sporet (eierskap)
2. Skriv ned dømmekraftlaget i produksjonsrepoet (port av `DESIGN.md`)
3. Automatiser drift-oppdagelse for token-synk i produksjon (ingen CI-sjekk i dag)
4. Sett opp Code Connect i produksjonsrepoet

**Gjenstående fra fase 1 (mekanisk fullføring, lavere prioritet enn målene over):**
1. ~~Multi-brand test (Uno X)~~ — **Validert.** Extended Collections fungerer per-node. Bør re-valideres med korrekt brand-liste (Uno-X/Kjeldsberg/7-Eleven/Narvesen).
2. Fullfør Tier 1 primitiver (Input, PriceDisplay)
3. Bygg Tier 2–3 komponenter (unntatt ProductCard — se komponentstatus over)
4. Nodes API pipeline (automatisk komponent-CSS)
5. Visuell regresjonstest (Figma screenshot vs web screenshot)
6. Migrere on-brand workaround fra Primitives til Semantics extensions
