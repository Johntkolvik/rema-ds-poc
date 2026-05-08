# Storybook-konvensjon

Alle komponenter i dette designsystemet skal ha en `.stories.tsx`-fil ved siden av komponenten. Denne filen følger en fast struktur slik at designere, utviklere og PM-er har et felles utgangspunkt.

## Når bruke en separat story vs. control

### Bruk en separat story når:

- **Statusen har semantisk betydning** — `Disabled`, `Loading`, `Empty`, `Error`. Disse er ikke «ulike størrelser av samme ting», de er distinkte tilstander.
- **Variantene er navngitte beslutninger** — `Primary`, `Secondary`, `Ghost`, `Danger`. Hver er et valg designeren gjør, ikke en gradering.
- **Stable deeplinks trengs** — designere/PM lenker til en spesifikk variant fra Figma, en ticket eller en design review.
- **Variantene matcher Figma-variantsett** — hvis komponenten i Figma har `Style=Primary/Secondary/Ghost/Danger` som navngitte varianter, skal hver ha en egen story med samme navn.

### Bruk kun controls (ingen ekstra story) når:

- **Dimensjonen er en gradering** — `size: sm | md | lg`, `spacing`, `density`. Visuell skalering uten semantisk forskjell.
- **Innholdet er åpent** — tekst, bilde-URL, lenker, callbacks. La controls-panelet drive utforskingen.
- **Variansen er teknisk, ikke visuell** — `onClick`, `aria-label`, `id`.

## Påkrevde stories

Hver komponent skal ha minst:

1. **`Default`** *(eller en story som matcher Figma-variantnavnet, f.eks. `Primary` for Button)* — den kanoniske, polerte versjonen. Dette er storyen Code Connect-lenker til, og storyen som a11y-tester med `test: 'error'`.
2. **`Overview`** (når det finnes >3 navngitte varianter) — viser alle varianter side-om-side for visuell review. Settes til `parameters.a11y.test = 'todo'` siden den ofte viser overlappende states.

Andre stories legges til når de oppfyller kriteriene over.

## Story-navngivning

- Bruk semantiske navn: `Primary`, `Disabled`, `WithIcon` — ikke `Variant1`, `Test2`.
- Match Figma-variantnavn der de finnes (gjør Code Connect-mapping enklere).
- For tilstander, bruk substantiv eller adjektiv: `Loading`, `Empty`, `Disabled`. Ikke verbformer som `IsDisabled`.

## Mal

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MyComponent } from './MyComponent';
import { figmaUrl } from '../../.storybook/preview';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaUrl('NODE:ID') },
  },
  argTypes: {
    // controls for dimensjoner som IKKE har egen story
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    // standardverdier — utgangspunkt for Default-storyen
    size: 'md',
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Kanonisk eksempel
export const Default: Story = {};

// Navngitte variants (kun hvis de oppfyller "separat story"-kriteriene)
export const Disabled: Story = { args: { disabled: true } };

// Side-om-side oversikt (kun ved >3 varianter)
export const Overview: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <MyComponent variant="Primary" />
      <MyComponent variant="Secondary" />
      <MyComponent variant="Ghost" />
      <MyComponent variant="Danger" />
    </div>
  ),
};
```

## Code Connect-kobling

`figma.connect()` skal lenke til `--default`-storyen i `links`-arrayet:

```ts
figma.connect(MyComponent, "https://figma.com/...", {
  links: [
    { name: 'Storybook', url: `${STORYBOOK_URL}/?path=/story/components-mycomponent--default` },
  ],
  // ...
});
```

`STORYBOOK_URL` er den deployede Storybook-instansen. Lokal utvikling bruker `http://localhost:6006`.

## A11y-strategi

`parameters.a11y.test`:
- **`error`** — for `Default` og polerte produksjons-stories. Brudd skal stoppe CI.
- **`todo`** — for `Overview` og eksperimentelle stories. Brudd vises i UI, men feiler ikke build.
- **`off`** — kun når komponenten med vilje viser et a11y-brudd som dokumentasjon.

Default i `.storybook/preview.ts` er `todo`. Override per story som over.

## Eksempler i dette repoet

| Komponent | Stories | Hvorfor |
|---|---|---|
| Button | `Primary`, `Secondary`, `Ghost`, `Danger`, `Sharp`, `Disabled`, `AllVariants` | Variant er semantisk, Disabled er state. Size er kun control. |
| Badge | `Primary`, `Danger`, `Subtle`, `All` | Hver variant er en navngitt designbeslutning. |
| RecipeCard | `Default`, `Overview` | Size er kun gradering — ikke egen story. |
| ProductCard | `Default`, `NoBadge` | Size er gradering. NoBadge er state (har vs. ikke-har et element). |
| PromoSection | `Default` | Kun én meningsfull konfigurasjon i dag. |
