import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Marketing and product copy must not claim a tax treatment before the
 * seller's regime is confirmed, and must not say customer data "stays in
 * the tenant" when document processing uses Google Gemini.
 */
const ROOT = join(__dirname, "..", "..");
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "coverage",
  "test-results",
  "playwright-report",
  "e2e-env",
]);
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".py", ".html", ".json"])

const FORBIDDEN: { name: string; re: RegExp }[] = [
  { name: "VAT wording", re: /\bVAT\b/i },
  { name: "IVA wording", re: /\bIVA\b/ },
  { name: "data-residency overclaim", re: /Data stays in your tenant/i },
];

function walk(dir: string, acc: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) {
      if (entry.name !== ".env.example" && entry.name !== ".github") continue;
    }
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path, acc);
    } else if (EXTENSIONS.has(extname(entry.name)) || entry.name === ".env.example") {
      // This test file may mention the forbidden phrases as patterns only.
      if (path === __filename) continue;
      acc.push(path);
    }
  }
}

describe("honest public copy", () => {
  const files: string[] = [];
  walk(join(ROOT, "src"), files);
  walk(join(ROOT, "backend"), files);
  const rootDocs = ["README.md", "backend/README.md", ".env.example"];
  for (const doc of rootDocs) {
    const path = join(ROOT, doc);
    try {
      statSync(path);
      files.push(path);
    } catch {
      /* optional */
    }
  }

  it("does not claim a tax treatment or that data stays in the tenant", () => {
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      const rel = relative(ROOT, file);
      for (const { name, re } of FORBIDDEN) {
        re.lastIndex = 0;
        const match = text.match(re);
        if (match) hits.push(`${rel}: ${name} (${match[0]})`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("does not present unbuilt CRM, SOP or Finance-pilot work as shipped", () => {
    const banned = [
      /Update your CRM and book the meeting/,
      /SOPs and runbooks executed end-to-end/,
      /SOPs, runbooks and vendors, instantly executable/,
      /Pick Sales, Support, Ops or Finance/,
    ];
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      const rel = relative(ROOT, file);
      for (const re of banned) {
        if (re.test(text)) hits.push(`${rel}: ${re.source}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
