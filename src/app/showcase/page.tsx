import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

export default function Showcase() {
  return (
    <main style={{ padding: "48px", display: "grid", gap: "48px", maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>Component Showcase</h1>

      <section>
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>
          Button — Style × Size × Shape
        </h2>

        <div style={{ display: "grid", gap: "24px" }}>
          {(["Primary", "Secondary", "Ghost", "Danger"] as const).map((variant) => (
            <div key={variant}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--global-text-quaternary)" }}>
                {variant}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <Button variant={variant} size="sm" shape="Pill">SM Pill</Button>
                <Button variant={variant} size="md" shape="Pill">MD Pill</Button>
                <Button variant={variant} size="lg" shape="Pill">LG Pill</Button>
                <Button variant={variant} size="md" shape="Sharp">MD Sharp</Button>
                <Button variant={variant} size="md" disabled>Disabled</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>Badge</h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Badge variant="Primary">Primary</Badge>
          <Badge variant="Danger">Danger</Badge>
          <Badge variant="Subtle">Subtle</Badge>
        </div>
      </section>
    </main>
  );
}
