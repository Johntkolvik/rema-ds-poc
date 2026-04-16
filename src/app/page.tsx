import { PromoSection } from "@/components/PromoSection";

export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "column" }}>
      <PromoSection
        headline="Til under 200-lappen"
        body={`Det er tid for ukens billigste middag \n- og vi har gjort planleggingen for deg.`}
        primaryCta={{ label: "Se ukas oppskrift", href: "#" }}
        secondaryCta={{ label: "Alle oppskrifter", href: "#" }}
        cardSize="md"
      />
      <PromoSection
        headline="Raske hverdagsmiddager"
        body="Under 30 minutter fra kjøleskap til middag."
        primaryCta={{ label: "Se alle", href: "#" }}
        cardSize="sm"
      />
    </main>
  );
}
