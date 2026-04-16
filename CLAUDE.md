# REMA Design System — POC

A living prototype proving that Figma Responsive variables map 1:1 to CSS custom properties. Built with Next.js 15 + Tailwind 4. Zero media queries inside components — all responsive behaviour comes from CSS custom properties changing at breakpoints.

## Figma file

- **File key:** `TPytjALjphlR0C6DJGvohU`
- **URL:** https://www.figma.com/design/TPytjALjphlR0C6DJGvohU/REMA-Variable-POC--GitHub-

### Key node IDs

| Component | Node ID | Page |
|---|---|---|
| RecipeCard (ComponentSet) | `2116:804` | Promo Section |
| RecipeCard Size=sm | `2116:772` | Promo Section |
| RecipeCard Size=md | `2044:669` | Promo Section |
| RecipeCard Size=lg | `2116:788` | Promo Section |
| PromoSection | `2044:734` | Promo Section |

## Architecture

### Responsive variable chain

```
Figma Responsive collection modes
         ↓
CSS custom properties in :root + @media blocks (globals.css)
         ↓
React components read vars via style={{ minWidth: "var(--card-md-min-w)" }}
         ↓
No media queries inside components
```

### Figma Responsive collection → CSS breakpoints

| Figma mode | CSS breakpoint |
|---|---|
| SM (default) | `:root` — no media query |
| MD | `@media (width >= 640px)` |
| LG | `@media (width >= 1024px)` |
| XL | `@media (width >= 1280px)` |
| 2XL | `@media (width >= 1536px)` |

## Variable naming conventions

All variables live in the Figma **Responsive** collection.

```
component/<component-name>/<property>
component/<component-name>/<size>/<property>
```

**Examples:**
```
component/card/padding
component/card/gap
component/card/radius
component/card/md/min-width      ← size-specific
component/card/md/max-width
component/card/sm/min-width
component/card/lg/min-width
component/promo-section/padding-top
component/promo-section/gap
component/promo-section/min-width
```

### CSS custom property naming

Mirror the Figma variable name — replace `/` with `-` and add `--`:

| Figma variable | CSS custom property |
|---|---|
| `component/card/md/min-width` | `--card-md-min-w` |
| `component/card/padding` | `--card-padding` |
| `component/promo-section/gap` | `--promo-gap` |
| `component/promo-section/padding-left` | `--promo-pl` |

All CSS tokens live in `src/app/globals.css`.

## Adding a new component

### 1. Create Figma variables

In the **Responsive** collection, add variables for each responsive property. Set values for all 5 modes (SM→2XL). Use scopes:
- `FRAME_FILL` / `SHAPE_FILL` → background/border colors
- `TEXT_FILL` → text colors
- `GAP` → spacing / gap
- `WIDTH_HEIGHT` → min/max widths
- `CORNER_RADIUS` → border radius

### 2. Bind variables to the Figma component

Use `setBoundVariable(prop, variable)` for layout props:
```js
node.setBoundVariable('paddingTop', paddingVar);
node.setBoundVariable('minWidth', minWidthVar);
node.setBoundVariable('itemSpacing', gapVar);
```

Use `setBoundVariableForPaint()` for fills:
```js
const newPaint = figma.variables.setBoundVariableForPaint(fill, 'color', colorVar);
node.fills = [newPaint];
```

If the component should have size variants (sm/md/lg):
```js
// Clone original, rename with variant syntax, combine
original.name = 'Size=md';
const sm = original.clone(); sm.name = 'Size=sm';
const lg = original.clone(); lg.name = 'Size=lg';
const set = figma.combineAsVariants([sm, original, lg], page);
set.name = 'ComponentName';
// Then bind size-specific vars per variant
```

### 3. Add CSS tokens

In `src/app/globals.css`, add to `:root` and each `@media` block:
```css
:root {
  --newcomponent-padding: 16px;
  --newcomponent-gap: 12px;
}
@media (width >= 640px) {
  :root { --newcomponent-padding: 20px; }
}
```

Values should match the Figma Responsive collection mode values exactly.

### 4. Build the React component

```tsx
// Use CSS vars for all responsive properties — no media queries
const style: CSSProperties = {
  padding: "var(--newcomponent-padding)",
  gap: "var(--newcomponent-gap)",
};
```

### 5. Create Code Connect file

Create `src/components/NewComponent.figma.tsx`:
```tsx
import figma from "@figma/code-connect";
import { NewComponent } from "./NewComponent";

figma.connect(
  NewComponent,
  "https://www.figma.com/design/TPytjALjphlR0C6DJGvohU/...?node-id=XXXX-XXXX",
  {
    props: {
      // Map Figma variant properties to React props
      size: figma.enum("Size", { sm: "sm", md: "md", lg: "lg" }),
    },
    example: ({ size }) => <NewComponent size={size} />,
  }
);
```

Point the URL at the **ComponentSet** node ID (the purple frame), not an individual variant.

### 6. Publish Code Connect

```bash
npm run figma:publish
```

This loads `FIGMA_ACCESS_TOKEN` from `.env.local` automatically.

## Commands

```bash
npm run dev           # Start dev server (http://localhost:3000)
npm run figma:publish # Publish Code Connect mappings to Figma
npm run build         # Production build
```

## Token storage

`FIGMA_ACCESS_TOKEN` is stored in `.env.local` (gitignored). Generate new tokens at:
**Figma → Account Settings → Personal access tokens**
