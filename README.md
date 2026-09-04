# TRY Design System — Figma to Code Pipeline (POC)

A living prototype proving that Figma variables (responsive, semantic, and brand)
map 1:1 to CSS custom properties. See [`CLAUDE.md`](CLAUDE.md) for the full
architecture and rules, and [`PRD-internal.md`](PRD-internal.md) for current
status, goals, and roadmap (Norwegian).

## The problem

TRY builds digital products for multiple brands in the Reitan family (REMA 1000,
Uno-X, Kjeldsberg, 7-Eleven, Narvesen, and potentially Reitan itself). Today,
design and code live as two separate truths that drift apart over time:
designers set spacing and colors in Figma, developers re-type those values in
CSS; responsive behavior is communicated via static mockups and interpreted by
hand; each brand's component library is copy-pasted rather than shared; and there
is no automated link between a Figma variable and the CSS it should produce.

## The vision

**One component. One source of truth. Every brand.**

A design system where Figma is the single source for all design decisions —
colors, spacing, typography, responsive behavior — code is generated from Figma
rather than guessed or re-typed, switching brands is selecting one Extended
Collection, and what you see in Figma is exactly what renders on the web.

This repo is the proof that the mechanism works. Whether it's ready to carry that
promise into production is tracked separately — see `PRD-internal.md` and
`TODO.md`.

## Development

Built with [Next.js](https://nextjs.org) 15 + Tailwind 4.

```bash
npm install
npm run dev              # http://localhost:3000
npm run storybook        # http://localhost:6006
npm run tokens:export    # regenerate tokens.generated.css from Figma
```

See [`CLAUDE.md`](CLAUDE.md) for the full command reference, the Figma variable
naming conventions, and the workflow for adding a new component.

## Learn more about Next.js

- [Next.js Documentation](https://nextjs.org/docs) — learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) — an interactive Next.js tutorial.

## Deploy on Vercel

Deployed at [rema-ds-poc.vercel.app](https://rema-ds-poc.vercel.app). See the
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for details on deploying your own instance.
