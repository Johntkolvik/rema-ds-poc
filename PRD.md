# Product Requirements Document
## TRY Design System — Figma to Code Pipeline

> **What is a PRD?**
> A Product Requirements Document defines *what* we're building, *why* it matters, and *how we know it works*. It's the shared contract between design, development, and stakeholders — the single source of truth for the product vision.

---

### The Problem

We build digital products for multiple brands — REMA 1000, Uno X, Narvesen, Kolonihagen. Today, design and code live as **two separate truths** that drift apart over time.

| What happens today | What it costs |
|---|---|
| Designers set spacing and colors in Figma. Developers re-type those values in CSS. | Every handoff introduces errors. Every update requires two changes. |
| Responsive behavior is communicated via static mockups at 3-4 breakpoints. | Developers interpret intent. Edge cases break. |
| Each brand has its own component library, duplicated across codebases. | One bug fix becomes five. Consistency is impossible at scale. |
| There is no automated link between a Figma variable and the CSS it should produce. | Design reviews catch visual drift weeks after it's introduced. |

---

### The Vision

**One component. One source of truth. Every brand.**

A design system where:

- **Figma is the single source** for all design decisions — colors, spacing, typography, responsive behavior
- **Code is generated from Figma** — not guessed, not copy-pasted, not re-typed
- **Switching brands** is a single variable change — every color, every token flows automatically
- **What you see in Figma is exactly what renders on the web** — same variables, same values, same breakpoints

---

### How It Works

#### The Token Chain

Design decisions flow in one direction — from Figma to code. Never backwards.

```
FIGMA                                          CODE
─────                                          ────

Primitives (per brand)                         
  REMA: blue-500 = #023ea5                     
  Uno X: blue-500 = #00857c                    
         ↓                                     
Semantics (brand-agnostic)                     
  --button-primary-bg → blue-500               
  --card-title → neutral-900                   
         ↓                                     
Component tokens (responsive)                  
  --button-md-height: 40px (mobile)            
  --button-md-height: 44px (tablet)            
  --button-md-height: 48px (desktop)           
         ↓                                     
    Figma REST API                             
         ↓                                     
                                    tokens.generated.css
                                    (642 CSS custom properties)
                                               ↓
                                    Components use only var(--token)
                                    Zero hardcoded values
                                    Zero media queries
```

#### Responsive Without Media Queries

Figma's Responsive collection has 5 modes. Each maps to a CSS breakpoint:

| Figma mode | Breakpoint | Device |
|---|---|---|
| SM | Default (mobile-first) | Phone |
| MD | 640px+ | Tablet |
| LG | 1024px+ | Laptop |
| XL | 1280px+ | Desktop |
| 2XL | 1536px+ | Large display |

The component code contains **zero `@media` queries**. All responsive behavior comes from CSS custom properties that change value at each breakpoint — the same values the designer set in Figma.

#### Brand Switching

The Primitives collection has one mode per brand:

```
Primitives mode: REMA        →  Blue = #023ea5, Red = #d71f2e
Primitives mode: Uno X       →  Blue = #00857c, Red = #e4002b
Primitives mode: Narvesen    →  Blue = #003da5, Red = #e31837
```

Every semantic token (`--button-primary-bg`, `--card-background`, etc.) references Primitives through an alias chain. Switch the mode, and the entire UI updates — in Figma and in code.

---

### What We've Proven

This POC validates the core hypothesis: **Figma variables can drive a production frontend with pixel-level fidelity.**

| Claim | Proof |
|---|---|
| Tokens export automatically from Figma | `npm run tokens:export` generates 642 CSS variables from the Figma REST API in < 3 seconds |
| Responsive behavior matches Figma exactly | 5 CSS breakpoint blocks map 1:1 to Figma Responsive collection modes |
| Colors resolve through the full alias chain | `--button-primary-bg → --global-bg-brand-solid → --color-brand-primary-500 → --color-blue-500 → #023ea5` |
| Components have zero media queries | RecipeCard and PromoSection contain 0 `@media` rules — all responsive behavior from tokens |
| Typography comes from Figma | Font size, line height, letter spacing all driven by `--typography-*` tokens |
| Visual fidelity is pixel-accurate | Side-by-side comparison: colors, spacing, typography, radius all match between Figma and web |
| Code Connect works | Figma Dev Mode shows real React code with correct props when inspecting components |
| Custom fonts load from tokens | `--font-family-primary: rema` drives `@font-face` loading — the token names the font |

**Live demo:** [rema-ds-poc.vercel.app](https://rema-ds-poc.vercel.app)

---

### Component Status

#### Built and validated

| Component | Figma | Code | Code Connect | Visual match |
|---|---|---|---|---|
| **RecipeCard** (sm / md / lg) | 3 size variants, responsive tokens | React + CSS vars | Published | Verified |
| **PromoSection** | Full responsive bindings | React + CSS vars | Published | Verified |
| **Button** (4 styles x 3 sizes x 3 states) | 36 variants, icon support | Not yet | Not yet | — |
| **Badge** (Primary / Danger / Subtle) | 3 variants | Not yet | Not yet | — |

#### Remaining (~20 components from the REMA prototype)

| Tier | Components | Purpose |
|---|---|---|
| **Primitives** | Input, PriceDisplay | Form elements, pricing |
| **Cards** | RecipeCategoryCard, NewsCard, ArticleHighlightCard, ProductCard | Content display |
| **Sections** | SectionWrapper, HeroBanner, TextHero, CtaBanner, SplitModule | Page layout |
| **Carousels** | ContentCarousel, ProductCarousel | Scrollable content |
| **Special** | FaqSection, ArticleHero, HubHero, AnimatedStats | Page-specific |

---

### The Workflow

For every new component, we follow the same five steps:

```
 1. DESIGN          Build the component in Figma.
                    Bind all spacing, colors, and typography to variables.
                    Set up variants (Size, Style, State).

 2. EXPORT          Run: npm run tokens:export
                    This pulls all variables from Figma and writes CSS.

 3. GENERATE        Use Figma's design context API to read the component.
                    Map every property to its CSS custom property name.
                    No hardcoded values. No media queries.

 4. CONNECT         Create a Code Connect file (.figma.tsx).
                    Run: npm run figma:publish
                    Figma Dev Mode now shows real code.

 5. VERIFY          Screenshot Figma component at mobile + desktop.
                    Screenshot web component at 375px + 1280px.
                    Diff should be ≈ 0.
```

---

### Success Criteria

| Metric | Target |
|---|---|
| Token sync time | < 60 seconds from Figma change to updated CSS in repository |
| Visual fidelity | < 2px deviation between Figma and web at same viewport |
| Brand switch | Change 1 CSS variable → entire UI changes brand |
| New component turnaround | < 2 hours from Figma design to deployed code |
| Code Connect coverage | 100% of component library |
| Breakpoint accuracy | 5 out of 5 Figma modes match CSS breakpoints exactly |

---

### What's Next

1. **Complete the component library** — Build remaining 20 components in Figma with full variable bindings, then generate code
2. **Nodes API automation** — Extend the export script to read component structure + bound variables, generating component CSS automatically (not just tokens)
3. **Multi-brand test** — Build a Uno X version by switching only the Primitives mode
4. **CI/CD pipeline** — GitHub Action triggers `tokens:export` when Figma variables change
5. **Visual regression testing** — Automated screenshot comparison between Figma and web on every deploy
6. **Dark mode** — The Semantics collection already has a Dark mode — wire it to `prefers-color-scheme`

---

### Technical Reference

| Layer | Technology |
|---|---|
| Design | Figma Variables, Responsive Modes, Code Connect |
| Token export | Node.js script → Figma REST API |
| Frontend | Next.js 15, Tailwind CSS 4 (CSS-first) |
| Token format | CSS Custom Properties (generated) |
| Deployment | Vercel |
| Repository | [github.com/Johntkolvik/rema-ds-poc](https://github.com/Johntkolvik/rema-ds-poc) |
