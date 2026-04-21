# Designsystem og REMA.no — Møtereferat
**Dato:** 21. april 2026, kl. 10:00
**Type:** Teams
**Deltakere:**
- **John Tøsse Kolvik** (TRY Dig, CXO) — presenterte POC og variabel-arkitektur
- **Pernille Backer Jæger** (REMA 1000, Ansvarlig MarTech)
- **Beate Gundersen** (REMA / App-teamet)
- **Representant(er) fra Shortcut** (App-utvikling / Design system)

---

## Kontekst

REMA 1000 bygger ny digital plattform (web + app). Tre parter er involvert:
- **TRY** — web-opplevelse (REMA.no), designsystem-arkitektur, brand
- **Shortcut** — app-utvikling, eksisterende design system (Foundations 2026)
- **REMA** — eier, MarTech, forretningskrav

Møtet hadde som mål å alignere designsystem-strategi, komponentstruktur og samarbeidsmodell mellom web og app. Ingen formelt scope eller budsjett er satt — dette var et strukturerings-møte.

---

## Beslutninger

### 1. Tre-lags variabel-arkitektur

Enighet om at designsystemet skal ha tre lag:

| Lag | Synlighet | Formål |
|---|---|---|
| **Primitives** | Skjult (ikke publisert) | Rå fargeverdier per brand (REMA, Uno X, Narvesen, Kolonihagen) |
| **Components** | Skjult (ikke publisert) | Kontekstuell bruk — `button-primary-bg`, `card-title` |
| **Semantics** | Publisert til designere | ~85 tokens i 3 kategorier: **Background**, **Text/Icon**, **Border** |

Designere skal **kun** ha tilgang til semantiske tokens — aldri primitives direkte. Dette reduserer feilvalg og sikrer konsistens.

> *"Ideelt sett skal du aldri knytte komponentene dine til noe annet enn semantics. Fordi semantics er konteksten — ikke inkrementene."* — John

### 2. Redusert fargepalett

Starte med **5 blå-nyanser** for å teste om en begrenset palett fungerer for app-teamet. Dagens palett er for stor og skaper inkonsistens.

### 3. Button som pilot-komponent

Enes om å bruke **Button** som proof-of-concept-komponent som skal fungere på:
- Responsive web (5 breakpoints)
- App (iOS/Android)
- Flere brands

> *"Ideelt sett — se på én komponent og se at den potensielt kan brukes på begge plattformer. Det er proof of concept. Fordi hver gang vi starter med 'hele systemet', blir det aldri ferdig."* — Shortcut

### 4. Dokumentasjon i GitHub, ikke Figma

Komponentdokumentasjon (PRD, bruksregler, edge cases) skal leve som **markdown-filer i GitHub** — ikke som Figma-frames. Dette gjør dem versjonskontrollerte, søkbare og tilgjengelige for utviklere.

### 5. Data-modell først

Ingen komponent uten forståelse av datakilden. Innholdsmodellen (Sanity CMS) skal støtte både web og app.

> *"Oppskrifter — få innholdsmodellen som appen kan konsumere."*

---

## Hva John demonstrerte (TRY POC)

John viste den levende prototypen med:

1. **Variabel-arkitektur** — Primitives med brand-modes (REMA, Uno X, Narvesen, Kolonihagen) → Semantics → Component tokens
2. **Responsive variable-system** — 5 modes (SM→2XL) som mapper 1:1 til CSS breakpoints. Komponentene har null media queries.
3. **Code Connect** — Figma Dev Mode viser ekte React-kode
4. **MCP + AI-assistert bygging** — Brukte Figma MCP til å bygge komponenter med korrekt variabel-binding, med AI som kvalitetssikring
5. **Live web-demo** — [rema-ds-poc.vercel.app](https://rema-ds-poc.vercel.app) med REMA-font, responsive tokens, pixel-match mot Figma

> *"Med MCP har jeg en slags schema — den forstår hvorfor jeg gjør det jeg gjør, og appliserer det konsekvent. Det er en kvalitetssikring av en maskin."*

---

## Hva Shortcut presenterte

Shortcut jobber med:

1. **Komponent-audit** — Gjennomgått eksisterende app-komponenter, identifisert redundans (f.eks. chip vs. badge — velger én)
2. **Button-komponent** — Alle states, shapes og sizes. Startet fra eksisterende bruk og bygget bakover.
3. **Farge-mapping** — Detaljert arbeid med primitives, semantics og naming conventions. Tre kategorier: background, text/icon, border.
4. **Navnekonvensjoner under revisjon** — Innså at nåværende naming ikke fungerer i praksis ved komponentbygging

> *"Da jeg begynte å jobbe med komponenter, føler jeg at [navngivningen] ikke gir mening. Så jeg må gå tilbake til den delen."*

---

## Viktige temaer diskutert

### Web ↔ App samspill
- Brukere skal ikke tvinges inn i én kanal (unified commerce)
- Web: mer marketing, tilgjengelighet, planlegging, søkbar innhold
- App: butikk-opplevelse, handlekurv, lojalitet
- Felles innholdsmodell via Sanity CMS slik begge kan konsumere samme innhold
- SSO/IDP kommer — felles bruker på tvers av web og app

### Code Syntax for plattformdifferensiering
Figma-variabler støtter `codeSyntax` som kan ha ulike endpoints per plattform:
```
codeSyntax.WEB = "--button-primary-bg"
codeSyntax.iOS = "ButtonStyle.primaryBackground"
```
Dette betyr at web og app kan bruke **samme Figma-variabler** men få ulike code snippets.

### Mål: Go-live august
Sommerkampanje-feature er målet. Fokus på det som faktisk brukes — ikke perfekt system.

> *"Iterasjon over perfeksjon — vi kjører med det vi har og tilpasser underveis."*

---

## Aksjonspunkter

| # | Hvem | Hva | Frist |
|---|---|---|---|
| 1 | **John** (TRY) | Finne felles hex-verdier for blå-farger, dele oppdatert fargefil med Shortcut | Denne uken |
| 2 | **John** (TRY) | Lage PRD og komponentdokumentasjon for Button som pilot | Medio mai |
| 3 | **Beate** (App) | Teste 5-nyanser blå-palett i app og rapportere erfaringer | Medio mai |
| 4 | **Pernille** (REMA) | Etablere Slack-kanal for daglig kommunikasjon om designsystem | Denne uken |
| 5 | **Beate + John** | Alignere på ett POC-komponent (responsivt, multi-brand) for validering | Ende mai |
| 6 | **Shortcut** | Revidere navnekonvensjoner for semantiske tokens basert på komponent-erfaring | Medio mai |

---

## Status på aksjonspunkt #2 og #3 (allerede påbegynt)

John har allerede i dag (etter møtet) bygget:

- **Button i Figma** — 36 varianter (Primary/Secondary/Ghost/Danger × sm/md/lg × Default/Hover/Disabled) med ikon-booleans, bundet til semantiske + responsive variabler
- **PRD** — Dokumentert hele arkitekturen, pipeline og komponent-status ([PRD.md](../PRD.md))
- **Token-pipeline** — `npm run tokens:export` genererer 642 CSS custom properties fra Figma REST API
- **Gap-analyse** — Sammenlignet Shortcut sin variabel-arkitektur med TRY sin ([se under](#gap-analyse))

---

## Gap-analyse: Shortcut vs TRY variabel-arkitektur

| Aspekt | Shortcut | TRY | Implikasjon |
|---|---|---|---|
| **Brand-bytte** | Spredt over 3 samlinger | 1 samling (Primitives modes) | TRY enklere å skalere |
| **Responsive web** | Mangler helt | 5 breakpoint-modes | Kritisk gap for Shortcut |
| **Dark mode** | Light/Dark i Semantics | ✅ Light/Dark i Semantics, eksporteres som `prefers-color-scheme: dark` | Begge har det |
| **Multi-plattform** | iOS/Android/Web modes | Kun Web | Shortcut dekker app |
| **Fragmentering** | 10 samlinger | ~6 samlinger | Shortcut risikerer inkonsistens |
| **Code pipeline** | Ingen | REST API → CSS → React → Vercel | TRY har automatisering |

**Anbefaling:** Kombiner TRY sin responsive pipeline + code automation + dark mode med Shortcut sine ikoner + plattform-tokens.

---

## Neste milestone

**Medio mai:** Variabel- og navigasjonsstruktur ferdig
**Ende mai:** Ett POC-komponent validert på tvers av web og app
**August:** Go-live med sommerkampanje-feature
