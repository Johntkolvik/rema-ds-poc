# Design System Update — 22. april 2026
**Til:** Design-teamet, TRY
**Fra:** John

---

## TL;DR

Vi har ryddet opp i variabel-arkitekturen i REMA POC-filen. Brand-bytte fungerer nå med Extended Collections (ikke modes), dark mode eksporteres til CSS, og 99.4% av alle variabel-bindinger i filen peker nå til våre egne lokale variabler. Det gjenstår 77 bindinger vi ikke kan fikse automatisk — de kommer fra eksterne bibliotek-komponenter.

---

## Hva har endret seg?

### 1. Brand-bytte: Fra modes til Extended Collections

**Før:**
```
Primitives-samlingen hadde 5 modes:
  DEFAULT | REMA | Uno X | Narvesen | Kolonihagen
```
Du byttet brand i en dropdown med alle 5 som valg.

**Nå:**
```
Primitives (parent)           → 1 mode: DEFAULT (nøytrale base-verdier)
  ↳ Primitives/REMA           → arver alt, overrider 21 verdier
  ↳ Primitives/Uno X          → arver alt, overrider 46 verdier
  ↳ Primitives/Narvesen       → arver alt, overrider 46 verdier
  ↳ Primitives/Kolonihagen    → arver alt, overrider 49 verdier
```
Du velger brand som en **collection** i layer-panelet — ikke en mode.

**Hvorfor:**
- Hvert brand trenger bare å definere det som er **annerledes** — resten arves automatisk fra parent
- Når vi legger til et nytt brand, starter det med 0 arbeid (arver alt) og vi overrider kun det som er ulikt
- Når vi endrer noe i parent (f.eks. legger til en ny variabel), får alle brands den automatisk
- Skalerer til N brands uten at filen blir uoversiktlig

### 2. Dark mode fungerer

Semantics-samlingen har Light og Dark mode — som før. Men nå eksporteres Dark mode til CSS automatisk:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --global-text-primary: var(--color-neutral-50);    /* lys tekst */
    --global-bg-primary: var(--color-neutral-900);     /* mørk bakgrunn */
    /* ... kun tokens som faktisk endrer seg */
  }
}
```

Komponentene trenger null endringer for å støtte dark mode — de bruker allerede semantiske tokens.

### 3. Uno X-kontrast fikset

Vi oppdaget at Uno X sine knapper hadde hvit tekst på lys bakgrunn — uleselig. Løsningen:

- Opprettet `color/brand/on-primary` i Primitives (hvit for de fleste brands)
- I `Primitives/Uno X` er den overridet til mørk (#171717)
- `Semantics/global/text/on-brand` aliaser dit — resolver automatisk gjennom riktig brand

**Viktig prinsipp:** Alias-kjeden traverserer automatisk. Når du velger `Primitives/Uno X` på en frame, finner alle Semantics-tokens riktig brand-verdi uten at Semantics trenger å vite noe om brands.

---

## Slik bruker du det nå

### Viktig å forstå: Extended Collections oppfører seg som modes

Å bytte Extended Collection føles akkurat likt som å bytte mode — du velger i samme meny i layer-panelet. Forskjellen er under panseret: modes krever at alle verdier er definert for alle brands, mens extensions bare definerer avvikene og arver resten.

### Bytte brand på en frame

1. Velg framen
2. I Appearance-panelet (høyre side) → klikk på variabel-ikonet
3. Velg **Collection:** `Primitives/REMA` (eller `Primitives/Uno X`, etc.)

Ferdig. Alle farger, fonter, radius og brand-spesifikke verdier oppdateres automatisk — fordi Semantics-aliasene resolver gjennom den valgte Primitives-extensionen.

> **Du trenger IKKE bytte Semantics-collection.** Semantics har ingen brand-extensions. Alias-kjeden finner riktig brand-verdi automatisk basert på hvilken Primitives-extension du har valgt.

### Bytte mellom Light og Dark

1. Velg framen
2. I Appearance-panelet → variabel-meny → **Semantics** → velg mode: `Dark`

### Oppsummert: 2 valg for full kontroll

| Hva du vil endre | Hvor du endrer | Eksempel |
|---|---|---|
| **Brand** | Primitives-collection | `Primitives/Uno X` |
| **Tema** | Semantics-mode | `Dark` |

Det er alt. Responsive breakpoints (SM→2XL) styres separat via Responsive-samlingen, men det er vanligvis satt per viewport-eksempel, ikke manuelt.

### Se alle brands side-by-side

Lag tre frames på canvasen. Sett hver til ulik Primitives-extension. Alt annet arves. Du kan ha REMA Light, Uno X Dark og Narvesen Light ved siden av hverandre.

---

## Opprydding: 99.4% lokale variabler

Vi har skannet **alle** noder i filen (utenom DS Framework-pagen) og rebundet remote-variabler til lokale:

| Kategori | Antall |
|---|---|
| ✅ Lokale bindinger | 13 749 |
| ⚠️ Gjenværende remote | 77 |
| 📊 Andel ren | 99.4% |

Mappingen vi brukte:

| Ekstern variabel (fra bibliotek) | Vår lokale variabel |
|---|---|
| `text/default` | `global/text/primary` |
| `surface/default` | `global/surface/default` |
| `Grey/10` | `global/border/secondary` |
| `Blue/50-Primary` | `global/bg/brand-solid` |
| `button/primary/background/default` | `component/button/primary/background` |
| `text/brand` | `global/text/brand` |
| `text/on-brand` | `global/text/on-brand` |
| `Icons/icon-default` | `global/fg/primary` |

---

## ⚠️ De 77 som gjenstår — trenger manuell hjelp

De siste 77 remote bindingene kan **ikke** fikses automatisk. De sitter på instanser av **eksterne bibliotek-komponenter**:

| Komponent | Kilde | Antall | Problem |
|---|---|---|---|
| **MetaItem** | Eksternt bibliotek | 4 | Bruker `text/muted` fra biblioteket |
| **StarRating** | Eksternt bibliotek | 4 | Bruker `text/muted` fra biblioteket |
| **Button (Outline/Small)** | Eksternt bibliotek | 4 | Bruker bibliotekets button-tokens |
| **Button (Secondary/Medium)** | Eksternt bibliotek | 3 | Bruker bibliotekets button-tokens |
| **RecipeCard-instanser** (nestede) | Lokalt, men inneholder eksterne sub-komponenter | 50 | Arver remote vars fra MetaItem/StarRating/Button inni seg |
| **Diverse** | Blanding | 12 | `text/muted`, `surface/brand-pressed` |

**Kjerneproblemet:** Noen av komponentene i filen er **instanser fra et eksternt Figma-bibliotek** (sannsynligvis "REMA Design System"). Disse instansene drar med seg bibliotekets variabler uansett hva vi gjør lokalt. Figma Plugin API kan ikke override fills på dypt nestede instans-noder (3+ nivåer).

### Hva må gjøres

1. **MetaItem og StarRating** — Lag lokale versjoner av disse sub-komponentene, bundet til våre variabler. Swap instansene.
2. **Button** — Vi har allerede en lokal Button-komponent (36 varianter!). De eksterne Button-instansene bør swappes til vår.
3. **Deaktiver det eksterne biblioteket** — Gå til Libraries-panelet og fjern "REMA Design System" (eller tilsvarende). Da unngår vi at noen ved et uhell bruker det igjen.

---

## Arkitektur-oversikt

```
Primitives (parent, 98 vars)     ← white-label base
  ↳ Primitives/REMA               ← 21 overrides (blå palett)
  ↳ Primitives/Uno X              ← 46 overrides (grønn palett + mørk on-primary)
  ↳ Primitives/Narvesen           ← 46 overrides (grønn palett)
  ↳ Primitives/Kolonihagen        ← 49 overrides (grønn palett)

Semantics (114 vars)              ← Light/Dark modes, brand-agnostisk
                                    Aliaser til Primitives → resolver automatisk per brand

Responsive (134 vars)             ← SM → 2XL breakpoints, delt for alle brands
                                    Typografi, spacing, komponent-sizing

Totalt: 931 CSS custom properties eksportert (inkl. dark mode)
```

## Viktig regel for alle som jobber i filen

> **Bruk KUN lokale variabler.** Når du velger en farge eller variabel, sjekk at det IKKE står "From [library name]" i variabel-velgeren. Velg alltid fra de lokale samlingene (Primitives, Semantics, Responsive). Eksternt bibliotek-variabler bryter brand-bytte og dark mode.

---

## Neste steg

1. Lag lokale MetaItem + StarRating-komponenter
2. Swap eksterne Button-instanser til vår lokale Button
3. Deaktiver det eksterne biblioteket
4. Fortsett med Tier 2-komponenter (NewsCard, SectionWrapper, HeroBanner)
5. Oppdater token-eksporten etter at alt er lokalt (`npm run tokens:export`)
