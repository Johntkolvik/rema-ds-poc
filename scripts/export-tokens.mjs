/**
 * export-tokens.mjs
 *
 * Fetches all local variables from the Figma file via REST API and
 * generates src/app/tokens.generated.css.
 *
 * Usage:
 *   npm run tokens:export
 *
 * Requires FIGMA_ACCESS_TOKEN in .env.local (loaded automatically by the
 * npm script via `export $(grep .env.local)`).
 *
 * Variable naming convention (Figma → CSS):
 *   component/card/md/min-width   → --card-md-min-width
 *   component/promo-section/gap   → --promo-section-gap
 *   primitives/color/brand/blue   → --color-brand-blue
 *
 * Responsive collection modes map to CSS breakpoints:
 *   SM  → :root (default / mobile-first)
 *   MD  → @media (width >= 640px)
 *   LG  → @media (width >= 1024px)
 *   XL  → @media (width >= 1280px)
 *   2XL → @media (width >= 1536px)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Config ───────────────────────────────────────────────────────
const FILE_KEY = "TPytjALjphlR0C6DJGvohU";
const OUT_FILE = path.join(ROOT, "src/app/tokens.generated.css");

/**
 * Breakpoints keyed by a prefix that will be matched against the
 * *beginning* of each Figma mode name (case-insensitive).
 *
 * Figma mode names can be "SM", "SM (Mobile)", "sm (mobile) - 0–639",
 * etc. — we match flexibly by prefix.
 */
const BREAKPOINT_PREFIXES = [
  { prefix: "sm",  bp: null     },   // default — no media query
  { prefix: "md",  bp: "640px"  },
  { prefix: "lg",  bp: "1024px" },
  { prefix: "xl",  bp: "1280px" },
  { prefix: "2xl", bp: "1536px" },
];

/** Look up the CSS breakpoint for a Figma mode name */
function getBreakpoint(modeName) {
  const lower = modeName.toLowerCase().trim();
  // Try "2xl" before "xl" to avoid prefix collision
  const sorted = [...BREAKPOINT_PREFIXES].sort(
    (a, b) => b.prefix.length - a.prefix.length
  );
  for (const { prefix, bp } of sorted) {
    if (lower.startsWith(prefix)) return bp;
  }
  return undefined; // unknown mode — will be skipped
}

// Collections to export, in order. Any collection not listed here
// is exported as a single :root block (no responsive breakpoints).
const RESPONSIVE_COLLECTION = "Responsive";

// ── Helpers ──────────────────────────────────────────────────────

/** Figma variable name → CSS custom property name */
function toCssVar(name) {
  return (
    "--" +
    name
      .replace(/^component\//, "")   // strip "component/" prefix
      .replace(/^primitives\//, "")  // strip "primitives/" prefix
      .replace(/^semantic\//, "")    // strip "semantic/" prefix
      .replace(/\//g, "-")           // remaining slashes → dashes
      .replace(/\s+/g, "-")          // spaces → dashes
      .toLowerCase()
  );
}

/** Resolve a VARIABLE_ALIAS chain to the original variable (for reference) */
function resolveAlias(value, variables) {
  if (value?.type === "VARIABLE_ALIAS") {
    return variables[value.id] ?? null;
  }
  return null;
}

/** Format a raw Figma variable value to a CSS string */
function formatValue(rawValue, resolvedType, variables) {
  // Alias → output a var() reference so CSS aliasing is preserved
  if (rawValue?.type === "VARIABLE_ALIAS") {
    const ref = resolveAlias(rawValue, variables);
    if (ref) return `var(${toCssVar(ref.name)})`;
    return null; // unresolvable alias — skip
  }

  if (rawValue === null || rawValue === undefined) return null;

  switch (resolvedType) {
    case "FLOAT":
      // Unitless 0 stays 0; everything else gets px
      return rawValue === 0 ? "0" : `${rawValue}px`;

    case "COLOR": {
      const { r, g, b, a = 1 } = rawValue;
      const hex = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
      if (a < 1) {
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a.toFixed(2)})`;
      }
      return `#${hex(r)}${hex(g)}${hex(b)}`;
    }

    case "STRING":
      return rawValue;

    case "BOOLEAN":
      return String(rawValue);

    default:
      return String(rawValue);
  }
}

/** Build a CSS :root { ... } block from a list of [property, value] pairs */
function rootBlock(declarations, indent = "") {
  if (declarations.length === 0) return "";
  const lines = declarations.map(([p, v]) => `${indent}  ${p}: ${v};`);
  return `${indent}:root {\n${lines.join("\n")}\n${indent}}\n`;
}

/** Build a @media block wrapping a :root block */
function mediaBlock(breakpoint, declarations) {
  if (declarations.length === 0) return "";
  const inner = rootBlock(declarations, "  ");
  return `@media (width >= ${breakpoint}) {\n${inner}}\n`;
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  const TOKEN = process.env.FIGMA_ACCESS_TOKEN;
  if (!TOKEN) {
    console.error("❌  FIGMA_ACCESS_TOKEN is not set.");
    console.error("    Add it to .env.local or export it in your shell.");
    process.exit(1);
  }

  console.log(`Fetching variables from Figma file ${FILE_KEY}…`);

  const res = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`,
    { headers: { "X-Figma-Token": TOKEN } }
  );

  if (!res.ok) {
    const body = await res.text();
    console.error(`❌  Figma API ${res.status}: ${body}`);
    process.exit(1);
  }

  const { meta } = await res.json();
  const { variables, variableCollections } = meta;

  // Index variables by ID for alias resolution
  const varById = variables; // already a { id: variable } map

  let css = `/* ============================================================
   AUTO-GENERATED — do not edit by hand.
   Run:    npm run tokens:export
   Source: https://www.figma.com/design/${FILE_KEY}/
   ============================================================ */\n\n`;

  let totalVars = 0;

  for (const collection of Object.values(variableCollections)) {
    // Only export local (non-remote) variables from this collection
    const collectionVars = Object.values(variables).filter(
      (v) => v.variableCollectionId === collection.id && !v.remote
    );
    if (collectionVars.length === 0) continue;

    css += `/* ── ${collection.name} ${"─".repeat(Math.max(0, 50 - collection.name.length))} */\n\n`;

    if (collection.name === RESPONSIVE_COLLECTION) {
      // Generate one block per mode, mapped to a CSS breakpoint
      for (const mode of collection.modes) {
        const bp = getBreakpoint(mode.name);
        if (bp === undefined) {
          console.warn(`⚠ Skipping unknown mode "${mode.name}"`);
          continue;
        }

        const declarations = [];
        for (const variable of collectionVars) {
          const rawValue = variable.valuesByMode[mode.modeId];
          const cssValue = formatValue(rawValue, variable.resolvedType, varById);
          if (cssValue === null) continue;
          declarations.push([toCssVar(variable.name), cssValue]);
        }

        if (bp === null) {
          css += rootBlock(declarations) + "\n";
        } else {
          css += mediaBlock(bp, declarations) + "\n";
        }

        totalVars += declarations.length;
      }
    } else {
      // Non-responsive collection → single :root block (first/light mode)
      const mode = collection.modes[0];
      const declarations = [];

      for (const variable of collectionVars) {
        const rawValue = variable.valuesByMode[mode.modeId];
        const cssValue = formatValue(rawValue, variable.resolvedType, varById);
        if (cssValue === null) continue;
        declarations.push([toCssVar(variable.name), cssValue]);
      }

      css += rootBlock(declarations) + "\n";
      totalVars += declarations.length;
    }
  }

  fs.writeFileSync(OUT_FILE, css, "utf-8");
  console.log(`✓ Exported ${totalVars} variables → ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
