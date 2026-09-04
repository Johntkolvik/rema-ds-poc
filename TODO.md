# TODO — REMA Design System

> **Målet dette er forankret i** (Beate Gundersen, app-teamet hos REMA): designsystemet
> skal (1) **eies av REMA**, (2) være **vedlikeholdbart av flere designere** — ikke
> avhengig av én person, og (3) være **funksjonelt nok innen utgangen av november,
> senest midten av desember**. Dette er *ikke* bundet til rema.no-lanseringen
> 22. september — den fristen gjelder nettsiden, ikke designsystemet.
>
> Sist oppdatert: 2026-09-04.

---

## Prioritert — knyttet direkte til Beates tre mål

### 1. Figma-filens eierskap — avklart, men reiser et nytt spørsmål
**Mål: eid av REMA.** Bekreftet 4. sept: "REMA.no Design System"
(`TPytjALjphlR0C6DJGvohU`) ligger på **TRYs egen Figma Enterprise-konto**, ikke
REMAs. REMA har i dag bare View-sete på sin egen org (`REMA 1000`, tier `org`) og
ingen tilgang til å redigere filen slik den ligger nå.

Foreslått løsning fra John: dele prosjektet med REMA via Figma **Shared Project**
(Enterprise-funksjon for tverr-org-samarbeid) — REMAs designere kunne da jobbe i
filen med sin egen REMA-lisens, mens TRY fortsatt drifter Enterprise-funksjonaliteten
rundt (variabler, Code Connect, publisering).

**Vurdering:**
- Shared Project er riktig *mekanisme* for akkurat dette scenarioet (byrå eier
  workspace, kunde samarbeider med eget sete) — teknisk sett løser det målet om at
  flere (REMA-)designere kan jobbe i filen.
- Men det er **deling, ikke eierskapsoverføring**. Filen tilhører fortsatt
  administrativt TRYs org — hvis TRYs Figma-avtale endres eller opphører, mister
  REMA tilgang til sitt eget designsystem. Løser ikke "eid av REMA" i streng
  forstand, bare det praktiske samarbeidsproblemet.
- **Konkret risiko vi selv fant 4. sept:** denne filen inneholder også primitiv-
  samlinger for andre TRY-kunder i samme fil — `Primitives/Holzweiler`,
  `Primitives/Kokkeløren`, `Primitives/Bjørklund` — side om side med
  `Primitives/REMA` under en felles `DS Framework`. Deler man prosjektet med REMA,
  får REMAs designere trolig også se disse. Ikke verifisert hvor mye (bare
  fargeprimitiver, eller mer), men bør avklares **før** deling, ikke etterpå.

- [ ] Avklar med Beate om Shared Project er godt nok for "eid av REMA"-målet, eller
      om det på sikt skal bli en reell overføring til REMAs org
- [ ] Sjekk nøyaktig hva `Primitives/Holzweiler` / `Kokkeløren` / `Bjørklund` faktisk
      inneholder, og om det er greit at REMA ser det
- [ ] Hvis ikke greit: skill ut REMA-relevante collections til en egen fil (eller
      dupliser til en REMA-only-fil) før Shared Project opprettes

### 2. Skriv ned dømmekraftlaget i produksjonsrepoet
**Mål: vedlikeholdbart av flere designere.** `packages/tokens/src/semantics.css` i
produksjonsmirroren viser at disiplinen (tekst tar `text-*`, aldri `fg-*`; ikoner tar
`fg-*`; kort tar `surface-*`; knapper/chips tar `bg-*`) faktisk **følges i praksis**
i dag — men lever bare som taus kunnskap. Uten et skrevet dokument (à la `DESIGN.md`
i denne repoen) er systemet avhengig av at akkurat de personene som satte det opp
blir værende — motsatt av målet.

- [ ] Port `DESIGN.md`-praksisen til produksjonsrepoet (eller lag en tilsvarende)
- [ ] Avklar eierskap til dokumentet med Beate/Ajit/Anders/Karina (se navngitte
      OPEN-punkter i `DESIGN.md` her: brand-farge på tekst, label-drift, pill-tokens,
      tone of voice)

### 3. Automatiser drift-oppdagelse for token-synk
**Mål: vedlikeholdbart av flere / funksjonelt.** I dag er synk fra Figma til
`packages/tokens` en **manuell** prosess: en Claude-sesjon kjører oppskriften i
`packages/tokens/CLAUDE.md` via Figma Plugin API, kun når noen husker å be om det.
Ingen CI-jobb sjekker Figma mot kode. Denne repoens `scripts/export-tokens.mjs`
(REST API mot `/variables/local`) beviste selv 4. sept at en enkel automatisert sjekk
fanger opp drift (en fargeendring fra juni) uten at noen må huske noe.

- [ ] Sett opp en skedulert (eller webhook-trigget) sjekk i produksjonsrepoet som
      kjører REST-eksporten og varsler/lager PR ved avvik
- [ ] Vurder om dette kan gjenbruke mønsteret fra `scripts/export-tokens.mjs` direkte

### 4. Sett opp Code Connect i produksjonsrepoet
**Mål: vedlikeholdbart av flere designere.** Finnes i denne POC-en, men ikke i
`tryhuset/rema.no`. Uten det ser designere i Figma Dev Mode aldri faktisk
produksjonskode — de er avhengige av å spørre en utvikler om ting stemmer.

- [ ] Kartlegg hvilke komponenter i `packages/ui` og `apps/web/src/components` som
      bør mappes først (start med de som allerede har Storybook-stories)
- [ ] Sett opp `.figma.tsx`-filer + `figma:publish`-flyt, tilsvarende denne repoen

### 5. Rydd duplikate CSS-egenskaper i generert token-CSS
**Lav prioritet, ren hygiene.** Fant flere linjer i
`packages/tokens/src/semantics.css` definert to ganger med ulik verdi i samme
`:root` (f.eks. `--component-button-secondary-background`,
`--global-bg-brand-solid-hover`). Siste vinner i CSS så det virker i dag, men er et
tegn på at synk-prosessen ikke rydder gamle linjer før den skriver nye.

- [ ] Bør løses naturlig når punkt 3 (automatisering) er på plass — den bør skrive
      filen fra bunnen hver gang, ikke append

---

## Oppfølging fra denne økten — ikke direkte knyttet til Beates mål, men åpne

- [ ] **To manglende tokens i denne POC-en** etter re-synk 4. sept: `--page-max-width`
      (brukt i [`src/components/ProductSection.tsx`](src/components/ProductSection.tsx))
      og `--promo-section-max-width` (brukt i
      [`src/components/PromoSection.tsx`](src/components/PromoSection.tsx)) finnes
      ikke lenger i Figma-filen, ingen erstatning funnet. Må enten gjenopprettes i
      Figma eller komponentene oppdateres til et annet eksisterende token.
- [ ] **403-bug i [`.github/workflows/deploy-storybook.yml`](.github/workflows/deploy-storybook.yml)**
      (denne repoen): mangler `permissions: pull-requests: write`, så
      PR-kommentar-steget feiler på hver PR (selve Storybook-buildet går fint).
      To-linjers fiks, ikke pushet — venter på avgjørelse. Vurder samtidig
      `paths-ignore: ['docs/**', '**/*.md']` så doc-endringer slutter å trigge builds.
- [ ] **Push siste to commits på `main`** i denne repoen til `origin`
      (token-resynk + `CLAUDE.md`-oppdatering, gjort lokalt 4. sept).
- [ ] **`codeSyntax` er bare satt for WEB/iOS** i Figma-filen (16 av 730 variabler) —
      ingen Android/kasse ennå. Relevant for Beate/Ajits mål om én JSON alle
      plattformer konsumerer; ikke denne repoens ansvar alene, men verdt å nevne i
      Design Sync.

---

## Kontekst / forbehold å huske

- Alt vi vet om produksjonskoden kommer fra `github.com/tryhuset/rema.no`, som
  ifølge repoets egen `AGENTS.md` er en **midlertidig mirror**. Kanonisk repo er
  `rhub.ghe.com/REMA/vendor-rema-no-app` (REMAs eget GitHub Enterprise) — vi har
  ikke tilgang dit. Behandle funn herfra som sterk indikasjon, ikke fasit.
- rema.no-lansering: 22. september 2026. Designsystem-målene over har egen frist
  (utgangen av november, senest midten av desember) og er uavhengige av
  lanseringsdatoen.
