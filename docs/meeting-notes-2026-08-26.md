# REMA 1000 Designsystem — Møtereferat

**Dato:** 26. august 2026, formiddag (ca. kl. 10:00–13:00)
**Sted:** REMA 1000s lokaler — fysisk møte
**Format:** Fire sammenhengende småmøter, dokumentert som to mobilopptak («Del 1» ca. 60 min, «Del 2» ca. 25 min)
**Kilde:** Trale-transkripsjon, opptak lastet opp 26.08.2026

**Deltakere (skifter mellom bolkene):**

| Bolk | Deltakere |
|---|---|
| 1. Kontekst og teamkartlegging | John Tøsse Kolvik (TRY Dig, CXO), Beate Gundersen (REMA, designleder app-teamet) |
| 2. Designerne | + to designere i app-teamet (Hedvig — via PwC, ca. 6 mnd; Anders — via Netlife, ca. 2 år) |
| 3. Token-arkitektur | John, Beate, Ajit (Shortcut, designsystem) |
| 4. Innhold og dokumentasjon | John, Beate, Karina (innhold/tekst, 20 % stilling) |

> **Om kildekvaliteten:** Opptakene er gjort på mobil i et rom med kryssende samtaler, og transkripsjonen har to parallelle kanaler som gjentar hver replikk i både bokmåls- og nynorskvariant. Navn er delvis utledet fra kontekst (Trale hadde ingen deltakerliste på disse opptakene). Der en tilskrivelse er usikker, er den markert. Del 2-opptaket fortsetter etter REMA-møtet inn i et separat Fargerike/Jotun-møte — det er holdt utenfor dette referatet (se [Avgrensning](#avgrensning)).

---

## Sammendrag

Møtet var Johns kartleggingsrunde inn i REMAs app-team — ikke et beslutningsmøte. Det som kom ut av det er likevel substansielt: **Ajit (Shortcut) har bygget et nytt token-fundament for appen, og ønsker å slå det sammen med TRYs web-designsystem til én kilde til sannhet.** Det gir en reell mulighet, men også en tidsklemme: designsystemet for rema.no går live om ca. 10 dager, og de native utviklerne er ennå ikke involvert.

Tre temaer bar møtet:

1. **Token-arkitektur.** Ajit foreslo tre lag (primitives → semantics → component). John argumenterte for to, der komponent-tokens er en *gruppe inne i* semantics, ikke en egen samling. Ajit gikk med på at det også fungerer. Målet begge deler: én JSON som web (React/Next), iOS (SwiftUI), Android og kassesystem konsumerer.
2. **Innhold hører ikke i Figma.** Tekststrenger som i dag bor i Figma-tekstbokser skaper dobbeltarbeid og reell produksjonsrisiko. Konkret eksempel fra Spenn-lanseringen dokumentert under. Retningen er CMS (Sanity) som eier av strenger, Figma som konsument.
3. **Systemet må håndheve regler, ikke verdier.** Vipps-knappen i den nye innloggingen brøt sammen ved zoom fordi verdier var satt absolutt. Det er akkurat feilklassen et token-drevet system eliminerer.

---

## Beslutninger og enighet

### 1. Designsystemet skal primært tjene REMA 1000-appen — men komponentene skal kunne gjenbrukes

Beate var tydelig: appen først. Men gjenbruk er et uttalt ønske mot selvbetjent kasse, digital vekt, Skann & betal, kassesystem og interne flater (Digit ber allerede om tilgang til designsystemet for interne nettsider).

> *«Først og fremst vil eg at designsystemet skal gjelde for REMA 1000-appen. Men vi har jo selvbetjent kasse, for eksempel. Eg har veldig lyst at vi skal kunne gjenbruke komponenten.»* — Beate

### 2. Token-struktur: semantics bærer komponentnivået

Ajit presenterte sitt forslag og stilte spørsmålet direkte: trenger vi primitive, semantic *og* component, eller holder primitive og semantic?

Johns svar: to lag. Semantics **er** komponentnivået. Komponent-tokens legges som en gruppe inne i semantics, ikke som en egen samling. Ajit bekreftet at han kan beholde komponentkontroll innenfor den strukturen.

| Lag | Rolle | Modes |
|---|---|---|
| **Primitives** | Rå verdier, merkevare-agnostiske navn (`brand`, ikke `blue`) | Brand (REMA, Uno X, …) |
| **Semantics** | Kontekst + komponentgrupper | Light / Dark |
| **Responsive** | Layout og sizing | SM → 2XL (web), plattform (app, POS) |

### 3. Én JSON som kilde til sannhet på tvers av plattformer

Dagens situasjon: iOS og Android har hver sin JSON i sine egne kodebaser, i separate rom — de kommer ut av sync. Ajits mål er én felles fil.

> *«At the end of the day the design system is consumed by these languages in a JSON format. So irrespective of which goes to React or iOS or SwiftUI or anywhere — the JSON is common.»* — Ajit

Enighet om at **navngivning kan avvike per plattform via code syntax** uten å bryte den felles strukturen. Hvis iOS vil kalle `large` for `900`, er det greit så lenge det peker på samme variabel. Ajit ønsker likevel like tokennavn på tvers, fordi navneendring er en atferdsendring for designerne hans.

### 4. Fasiten for design skal ligge i Figma — dokumentasjon kuttes til «core»

Beates betingelse er at fasiten ligger i Figma, ikke spredt i Confluence. Ajits dokumentasjon er så omfattende at man «kan drukne i den»; Karina har fått oppgaven å kutte den ned til det essensielle.

Johns posisjon: den tekniske dokumentasjonen (states, variabler, hvilke tokens som er i bruk) genereres nå automatisk — av Figma-agenter og skills. Det som er verdt å skrive manuelt er **formål**.

> *«Det viktigste konteksten til AI og til menneske er liksom formål. Alt annet blir bare veldig detaljert og ikke lest.»* — John

### 5. Vilkår og Konto flyttes fra webview til native

Besluttet i app-teamet. John påpekte paradokset: kontoen ligger på web, mens man ikke kan logge inn på web.

### 6. Systemet skal styres av regler, ikke absolutte verdier

Utløst av en konkret feil fra den nye innloggingen (ca. 300 timers arbeid): Vipps-knappen fikk teksten til å vokse ut av knappen ved zoom på telefon, med hvit tekst på lys bakgrunn — usynlig for svaksynte. Årsak: absolutte verdier i kode.

> *«Så lenge du ikke setter absolutt — og de skal liksom aldri rokkes ved — så vil du ikke få den feilen.»* — John

### 7. Rollefordeling innhold vs. design er avklart

Karina eier innhold: tittel, knappetekst, mikrokopi, formulering av juridiske tekster. Design-tekniske regler (maksbredde, om en komponent kan strekkes) eier designerne — Anders eller Ajit. Dokumentasjonen skal skille de to.

---

## Hva John demonstrerte

John viste POC-en fra `rema-ds-poc` og forklarte fire mekanismer:

**Splittet primitiv-palett med parvis kontrastgaranti.** Blå deles i to paletter med speilende nummerering, slik at 600 alltid matcher 600 i den andre paletten. Da slipper designeren å huske at 90 hører til 10 og at 70 er noe annet.

> *«It's like you're bringing semantic meaning to the primitives.»* — Ajit

**Merkevare-agnostiske primitiv-navn.** Du endrer ikke «blå», du endrer «brand». Samme mekanikk brukes for konsept-nivået — Crazy Days, Spenn, interne verktøy — som gjør at en komponent kan skifte drakt uten å forlate systemet. «A brand within a brand.»

**Extended Collections for brand-varianter.** Krever Figma Enterprise, som Ajit ikke har. Løsningen: TRY gir dev-tilgang, eller gjør prosjektet delt slik at REMA kan bruke sin egen lisens inne i TRYs fil.

**Responsive modes som erstatter designerens størrelsesvalg.** I stedet for at designeren velger «liten knapp» på mobil og «stor knapp» på desktop, ber man om `large` og lar modet avgjøre verdien. Samme mekanikk skalerer til plattform: `large` er noe helt annet på en kasseskjerm enn i appen.

> *«You should say that I want the small button — and the small button is larger on desktop.»* — John

**Storybook som utviklerflate.** Web-komponentene publiseres med automatiske a11y-sjekker (27 krav bestått, ingen brudd på komponenten som ble vist), snart som eget subdomene under rema.no, med tokens matet direkte fra GitHub. Ajit har fått bekreftet at Storybook ikke kan brukes for Swift/native — der er Chromatic/visuell regresjon relevant for web-delen, og Code Connect binder Figma-komponent til Storybook slik at både mennesker og agenter får kontekst.

---

## Hva Ajit presenterte

Ajit har bygget et nytt fundament i Figma og skriver nå epics og stories for det:

- **Tre samlinger i semantics:** background, border, foreground (+ shadow). Light/dark definert per token.
- **Primitives redusert** fra 21 til 10 nyanser, inspirert av TRYs fem blå.
- **Brands holdt separat** (REMA, Uno X, med egne feedback-farger) slik at de kan eksporteres til egne foundation-filer hvis de skal skilles senere.
- **Component-nivå** som egen samling — punktet John utfordret.
- **Fortsatt pågående:** kontrast-audit.

Hans strategiske ramme er viktig: han fremstiller dette internt som **ett samlet designsystem for web, app og kasse**, nettopp for å gjøre effort og bemanning forståelig for alle parter.

> *«We don't want to throw away the current one. We can retain and refresh, or refactor. For example token name is one of the biggest changes I am looking at — obviously the token will have a cascading effect.»* — Ajit

---

## Det viktigste problemet: innhold i Figma

Dette var møtets tydeligste funn, og det ble konkretisert med et faktisk hendelsesforløp.

**Hva skjedde ved Spenn-lanseringen:** Flere steder i flyten ble bottom sheets brukt for å forklare Spenn — «du tjener på dette og dette» — med teksten skrevet direkte i Figma-tekstbokser, i ulike varianter avhengig av hvor i flyten brukeren var. Da premissene endret seg (bilvask skulle ut), måtte man først finne hver forekomst i Figma, og deretter måtte utvikleren gjøre nøyaktig samme jobb på nytt i kode.

**Hvorfor det er mer enn irritasjon:**

- Dobbelt manuelt arbeid, hver gang
- Ingen garanti for at Figma-teksten faktisk når produksjon
- Designere ender som eiere av tekst de ikke skal eie — inkludert juridiske tekster
- Feil forplanter seg, og de oppdages sent

> *«En designer skal ikke sitte med privacy policy-tekst og prøve å rite det. Det er ikke ekte.»* — John

> *«Jeg føler at vi jobber i Figma på en måte som er bare sånn: du gjør sykt mye manuelt arbeid, og så må du gjøre den samme tingen en gang til.»* — designer (antatt Anders)

**Retningen:** strengene eier i CMS (Sanity), én versjon, hentet inn i Figma via plugin, og konsumert av appen som JSON — teknisk sett samme mekanikk som tokens. Teamet har tidligere sett på Ditto, men det løser bare Figma-siden.

> *«Jo før appen går over til CMS, jo bedre.»* — John

Karina utforsker dette allerede. John tilbød å bygge en pocketcase i Sanity som viser både innholdsstyring og hvordan hjelpetekster og designregler kan presenteres, til gjennomgang sammen med Karina.

---

## Prosess, roller og governance

**Design Sync:** hver mandag 10–11, Beate eier møtet, alle bidrar. Utvidet med en ekstra time ved behov. Aktuelle temaer: hvor mange varianter av bottom sheet som skal finnes, når alert badge vs. chip skal brukes, og inkonsistent knappetekst (ferdig / lukk / avslutt). Ajit har dokumentert dette, men adopsjonen falt av. John ba om tilgang til dokumentasjonen, og bemerket at governance bare virker hvis det finnes en gulrot.

**Veien til produksjon i dag:**

```
Instruks fra produkteier → design → designreview med andre designere
  → Azure DevOps-oppgave → sprintplanlegging (én iOS- + én Android-utvikler)
  → utvikling → testere (UU, visuelt, logikk) → designerne som del av akseptansetest
  → tilbakemelding i Slack
```

Designerne ønsker at skisser er «prikkfrie» — utviklerne skal ikke måtte tenke selv. Samtidig er det en erkjennelse i teamet av at tidligere samarbeid med utvikler ville spart runder.

**Personer og roller kartlagt:**

| Person | Rolle |
|---|---|
| Beate Gundersen | Designleder app-teamet, eier Design Sync, beslutningstaker på designsystem |
| Ajit (Shortcut) | Designsystem, token-arkitektur, epics/stories |
| Karina | Innhold og tekst, 20 %, dokumentasjonsstruktur |
| Hedvig (PwC) | Designer, overtar Jonas' «Overblikk»-prototype |
| Anders (Netlife) | Designer, starter opp eget prosjekt for B2B-app |
| Tjenestedesigner (2 dager/uke) | Kun Skann & betal |
| Øystein | Produkteier per nå, sterk på iOS |
| Åge | Produkteier, to dager igjen |
| Nora | Måling og analyse av appbruk |
| Ragnar / Bikram (Shortcut) | Native-utviklere (iOS / Android), sitter i Shortcut-kontoret |
| Henning (Digit) | Bygger kontrollapp for butikkansatte |
| Jonas | Sluttet; bygget «Overblikk»-prototypen med Claude Code |

**Tofveis-flyt:** John påpekte at utviklere kan pushe variabler tilbake til Figma. Ajit har foreslått det motsatte — endring i Figma pushet til kode — og fikk nei fra en utvikler: noe må gjennom review. Johns poeng er at regler og lint gjør alignering mulig uten teknisk gjeld.

**AI-modenhet:** Ajits designere er «not so AI friendly, at least as of now», og utviklerne bruker AI men rører ikke designsystemet — de bygger logikk og funksjonalitet.

---

## Risiko og blokkere

| # | Risiko | Konsekvens |
|---|---|---|
| 1 | **Tidsklemme:** designsystemet for rema.no går live om ca. 10 dager, native-utviklerne er ikke involvert | Web-systemet låses uten app-input; migrering blir dyrere senere |
| 2 | **Ukjent teknisk fleksibilitet i appen**, særlig Android | Refaktorering kan bli mer omfattende enn antatt. iOS antas godt rigget (egen iOS-designsystem finnes) |
| 3 | **Ingen dedikert utviklingsvindu** for designsystem-arbeidet ennå | Ajits arbeid har hittil skjedd «i utforskningens navn»; effort-estimat mangler |
| 4 | **Manuell sync av tekst og design** mellom Figma og produksjon | Dobbeltarbeid og feil som forplanter seg (dokumentert over) |
| 5 | **Lisenskostnad i Figma** for Extended Collections (Enterprise) ikke avklart | Blokkerer full bruk av brand-arkitekturen |
| 6 | **Navneendring på tokens** oppleves som vanskelig av Ajits designere | Adopsjonsrisiko; de er vant til direkte navn som `surface`, `border` |
| 7 | **Personvern rundt endring av mobilnummer/e-post** ikke løst | Blokkerer videre arbeid på kontofunksjonalitet |
| 8 | **GA-data for appen er ikke tilgjengelig for designteamet** | Beslutninger tas uten atferdsdata. Johns vurdering: «helt kritisk» |
| 9 | **Ingen roadmap** og produkteierrollen i flux (Åge ut, Øystein interim) | Ingen som balanserer opplevelse × kommersielt × teknisk |

---

## Aksjonspunkter

| # | Hvem | Hva | Frist |
|---|---|---|---|
| 1 | **Ajit** | Walkthrough med native-utviklerne Ragnar + Bikram: kan appen bruke dette designsystemet, hvor mye arbeid, hvilke bekymringer | Neste uke |
| 2 | **Ajit** | Hente designernes tilbakemelding på navneendringen (semantic/primitive), og ta samlet input til Beate for beslutning | Neste uke |
| 3 | **John** | Dele JSON/token-fil med Ajit slik at native-utviklerne kan kjøre den gjennom sitt oppsett | Snarest |
| 4 | **John** | Gi Ajit dev-tilgang til Figma-filen (Extended Collections) eller sette opp delt prosjekt | Snarest |
| 5 | **John** | Bygge utvalgte app-skjermer og states i det nye systemet — inkl. skjermen Ajit ba om — så sammenligningen blir konkret | Til neste møte |
| 6 | **John** | Skrive en kort plan for designsystem og governance basert på dagens diskusjon | Denne/neste uke |
| 7 | **John** | Bygge pocketcase i Sanity: innholdsstyring + presentasjon av hjelpetekster og regler, gjennomgang med Karina | Ikke satt |
| 8 | **Karina** | Sende over eksempler på sin dokumentasjonsstruktur på e-post (norsk + engelsk) | Snarest |
| 9 | **Beate** | Avklare lisenskostnad i Figma for utvidet bruk (Enterprise-nivå) | Snarest |
| 10 | **Beate** | Dele overordnet strategi-slide for REMA 1000 (pris, leverandør, miljø) | Ikke satt |
| 11 | **Beate** | Gi John tilgang til Ajits komponentdokumentasjon (bottom sheet, alert badge, chip) | Ikke satt |
| 12 | **John / Beate** | Sette opp møte med Nora om måling og segmentering av appbruk | Ikke satt |
| 13 | **John** | Ta initiativ til samtale om CMS i appen | Ikke satt |
| 14 | **John** | Ved neste møte: varsle i forkant, ta med utvikler, og koordinere at Ragnar/Bikram kan delta fra Shortcut-kontoret | Neste møte |

---

## Forretningskontekst fanget underveis

Ikke agenda, men relevant for prioritering av designsystemet:

**Appens formål er uskarpt.** Appen er i praksis en markedsføringsflate, ikke en kommunikasjonskanal. Hjemskjermen eies av digitalt kampanjesalg, og internt innhold — «en kjøpmann har vunnet noe» — fortrenger brukerens toppoppgaver. Produktteamet testet en restrukturert hjemskjerm i fjor med stories/reels, priskutt, kundeavis og aktivering; det fungerte godt, men tapte den interne kampen mot leverandørbetalt plassering.

> *«Jeg tror at hvis det bare hadde vært opp til oss som produktteam, så hadde nok den hjemskjermen sett helt annerledes ut.»* — designer (antatt Anders)

**Måling er i ferd med å bli reell.** Nora måler nå bruk. «Holy grail»-måling er på vei: en energidrikk-kampanje viste at sjeldne kjøpere som ble eksponert kjøpte 50 % mer enn andre. Strekkodeskanneren er brukt 500 000 ganger hittil i år. Men segmentering av høy-/medium-/lavverdikunder er bare diskutert, ikke gjort — og GA-dataen er ikke tilgjengelig for designteamet.

**Innlogging på web er en policy-blokker, ikke en teknisk.** Ingenting hindrer det teknisk; det har vært en holdning at «web har ikke livets rett». Konsekvensen er at all markedsføring peker mot web der du verken kan planlegge, bli medlem eller se medlemskapet ditt.

**Kundeavis-flyten stopper halvveis.** Det finnes nå en feed fra papirflyet som gir produktkort med pris i appen, men uten «legg til i liste»-knapp. QR-koder i papiravisen er testet. Kobles til innlogging.

**Priskommunikasjon er strategisk uforløst.** REMA skal være best på pris, men Johns poeng er at det ikke er nok å *ha* beste pris — kunden må *tro* det. Han fortalte om en handlekurv på ca. 8 000 kr som kom ut med 10 kr differanse mellom ODA og Meny, og mener appopplevelsen bør bevise REMAs prisposisjon.

**Vekst måles i handlekurv.** Én ekstra vare per medlem er stort. Betalende/innloggede kunder har større kurv.

**Skann & betal** rulles ut til alle butikker i Norge, følger ikke designsystemet i dag, og bytter teknisk leverandør til GK (samme som kassesystemet). Kassesystem og omnikanal beskrives som «ekstremt formelt» og utdatert — en blokker.

**B2B-app** er besluttet som eget prosjekt (Anders starter opp): buy now, pay later, QR-basert, som erstatning for dagens papirlapp-signering. Ny kasse har brutt den gamle flyten. Johns vurdering: dagens prosess har null governance og ingen dataspor.

**Johns estimat:** appen kan tegnes opp på nytt på 4–6 uker med et godt designsystem på plass.

---

## Avgrensning

Del 2-opptaket fortsetter etter at REMA-møtet ble avsluttet, og fanger et påfølgende **Fargerike-møte om Jotuns color picker-widget** (fly-in drawer vs. modal, glansgrad-steg som hoppes over ved ett valg, rekkefølge farge → glansgrad → volum på PDP). Det hører ikke til dette referatet og er utelatt. Kan skrives opp separat ved behov.

---

## Neste steg

Kritisk sti fram til rema.no går live om ca. 10 dager:

1. **Ajit får JSON og Figma-tilgang** (aksjon 3 + 4) — uten dette kan ikke utviklerne vurdere effort
2. **Native-utviklerne inn i samtalen** (aksjon 1) — dette er den ene tingen som ikke kan utsettes til etter go-live
3. **John bygger app-skjermer i systemet** (aksjon 5) — flytter diskusjonen fra prinsipp til pixel
4. **Plan for designsystem og governance skrives** (aksjon 6) — og bør inkludere CMS-sporet, ikke bare tokens

Neste møte er mer hands-on, med utvikler til stede fra begge sider.
