# REMA Design System — POC

A living prototype proving that Figma variables (responsive, semantic, and brand) map 1:1 to CSS custom properties. Built with Next.js 15 + Tailwind 4. Zero media queries inside components — all responsive behaviour comes from CSS custom properties changing at breakpoints.

**Demo:** [rema-ds-poc.vercel.app](https://rema-ds-poc.vercel.app)

## Figma file

- **File key:** `TPytjALjphlR0C6DJGvohU`
- **URL:** https://www.figma.com/design/TPytjALjphlR0C6DJGvohU/REMA-Variable-POC--GitHub-

### Key node IDs

| Component | Node ID | Page |
|---|---|---|
| RecipeCard (ComponentSet) | `2342:8605` | Promo Section |
| RecipeCard.Meta-Fields | `2851:22738` | Promo Section |
| PromoSection | `2044:734` | Promo Section |
| ProductCard (ComponentSet) | `2170:339` | Product Section |
| Button (ComponentSet, 72 variants: Style×Size×State×Shape) | `2136:1324` | --- Content Blocks |
| Badge (ComponentSet, 3 variants) | `2154:2660` | --- Content Blocks |
| icon/arrow-right | `2134:6806` | --- Content Blocks (unverified) |

## Architecture

### Three-layer variable chain

```
Figma Primitives (brand colors — modes: REMA, Uno X, Narvesen, Kolonihagen)
         ↓ aliases
Figma Semantics (contextual tokens — modes: Light, Dark)
  ↳ Extended Collections per brand (Semantics/REMA, Semantics/Uno X, etc.)
  ↳ Only brand-specific overrides — rest inherited from parent
         ↓ aliases
Figma Responsive (layout + sizing — modes: SM, MD, LG, XL, 2XL)
         ↓ REST API export
tokens.generated.css (931 CSS custom properties incl. dark mode)
         ↓ @import
React components use only var(--token) — zero hardcoded values
```

### Extended Collections (Enterprise)

Brand-specific semantic overrides live as Extended Collections on Semantics:

| Collection | Type | Overrides |
|---|---|---|
| `Semantics` | Parent | Base values (works for most brands) |
| `Semantics/REMA` | Extended | 0 (identical to base) |
| `Semantics/Uno X` | Extended | 3 (on-brand → dark text for contrast) |
| `Semantics/Narvesen` | Extended | 0 (ready for overrides) |
| `Semantics/Kolonihagen` | Extended | 0 (ready for overrides) |

Designers select the extension per frame in the layer panel — brands can be previewed side-by-side on the same canvas.

### Responsive collection → CSS breakpoints

| Figma mode | CSS breakpoint |
|---|---|
| SM (default) | `:root` — no media query |
| MD | `@media (width >= 640px)` |
| LG | `@media (width >= 1024px)` |
| XL | `@media (width >= 1280px)` |
| 2XL | `@media (width >= 1536px)` |

### Dark mode

Semantics has Light/Dark modes. The export script generates:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --global-text-primary: var(--color-neutral-50);  /* was neutral-900 */
    /* ... only tokens that differ from Light */
  }
}
```

## Variable naming conventions

Variables are organized across collections:

```
Primitives:    color/blue/500, color/brand/primary/500, color/brand/on-primary
Semantics:     global/text/brand, global/bg/primary, button/primary/background
Responsive:    component/<name>/<property>, component/<name>/<size>/<property>
               typography/<style>/<property>
```

### CSS custom property naming

The export script transforms names: strip prefix (`component/`, `primitives/`, `semantic/`), replace `/` with `-`, prepend `--`:

| Figma variable | CSS custom property |
|---|---|
| `component/card/md/min-width` | `--card-md-min-width` |
| `component/card/padding` | `--card-padding` |
| `component/promo-section/gap` | `--promo-section-gap` |
| `global/text/brand` | `--global-text-brand` |
| `button/primary/background` | `--button-primary-background` |
| `typography/heading/2xl/size` | `--typography-heading-2xl-size` |

## Adding a new component

### 1. Create Figma variables

In the **Responsive** collection for layout tokens, **Semantics** for colors. Set values for all modes. Use specific scopes (not ALL_SCOPES).

### 2. Bind variables to the Figma component

```js
node.setBoundVariable('paddingTop', paddingVar);    // layout props
node.setBoundVariable('itemSpacing', gapVar);
const paint = figma.variables.setBoundVariableForPaint(fill, 'color', colorVar);
node.fills = [paint];                                // color props
```

### 3. Export tokens

```bash
npm run tokens:export   # Fetches from Figma REST API, writes tokens.generated.css
```

Verify: `grep 'undefined' src/app/tokens.generated.css` should return nothing.

### 4. Generate component code

Use `get_design_context` on the Figma node, then map to `var(--token)` references. No hardcoded values, no media queries.

### 5. Code Connect

```tsx
// src/components/NewComponent.figma.tsx
figma.connect(NewComponent, "...?node-id=XXXX-XXXX", {
  props: { size: figma.enum("Size", { sm: "sm", md: "md", lg: "lg" }) },
  example: ({ size }) => <NewComponent size={size} />,
});
```

Point URL at **ComponentSet** node ID (purple frame), not individual variant.

### 6. Publish

```bash
npm run figma:publish
```

## Critical rules

1. **Never use remote/library variables** — all bindings must be local to this file
2. **Never bind components to Primitives** — always use Semantics
3. **Brand-specific overrides** go in Extended Collections (e.g. Semantics/Uno X), not in Primitives
4. **Responsive layout tokens** live in the Responsive collection with 5 breakpoint modes
5. **Color tokens** live in Semantics with Light/Dark modes

## Commands

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run storybook        # Start Storybook (http://localhost:6006)
npm run build-storybook  # Static Storybook build → storybook-static/
npm run tokens:export    # Export 931 variables from Figma REST API → tokens.generated.css
npm run figma:publish    # Publish Code Connect mappings to Figma
npm run build            # Production build
```

## Storybook

Storybook 10 is set up as the canonical design-system documentation surface. Each component has a `.stories.tsx` file co-located with the component. Stories link back to Figma via the `parameters.design` field, using the `figmaUrl()` helper from `.storybook/preview.ts`.

**Addons enabled:**
- `@storybook/addon-a11y` — axe-core accessibility checks (WCAG / Norwegian UU). Configured as `test: 'todo'` in `.storybook/preview.ts`; flip to `'error'` to fail CI on violations.
- `@storybook/addon-designs` — embeds the Figma frame in the addon panel for side-by-side review.
- `@storybook/addon-vitest` — story-level tests via Vitest.
- `@chromatic-com/storybook` — visual regression baseline (Chromatic).

**Adding a new story:**

```tsx
// src/components/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MyComponent } from './MyComponent';
import { figmaUrl } from '../../.storybook/preview';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    design: { type: 'figma', url: figmaUrl('NODE:ID') },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
```

**QA / QC workflow (design ↔ code):**
1. Designer updates Figma component
2. Developer runs `npm run tokens:export` if tokens changed
3. Developer updates React component to match
4. Story renders the updated component side-by-side with the embedded Figma frame in Storybook
5. a11y panel verifies WCAG/UU compliance
6. `npm run figma:publish` updates Code Connect snippets shown in Figma Dev Mode

## Token storage

`FIGMA_ACCESS_TOKEN` is stored in `.env.local` (gitignored). Generate at:
**Figma → Account Settings → Personal access tokens**

## Key documents

| Document | Purpose |
|---|---|
| `PRD.md` | English presentation-ready PRD |
| `PRD-internal.md` | Norwegian internal reference |
| `docs/STORYBOOK.md` | Storybook-konvensjon (når separat story vs. control, navngivning, a11y-strategi) |
| `docs/RFC-brand-x-theme-architecture.md` | Brand × Theme architecture analysis |
| `docs/meeting-notes-2026-04-21.md` | REMA/Shortcut meeting notes + action items |
