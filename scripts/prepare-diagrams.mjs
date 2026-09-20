import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Keep exported Mermaid artwork unchanged; only make its canvas and intrinsic
// dimensions explicit for Markdown embeds and standalone GitHub image previews.
export function prepareDiagram(source) {
  const root = source.match(/<svg\b[^>]*>/);
  if (!root) throw new Error("Missing SVG root");
  const viewBox = root[0].match(/\bviewBox="([^"]+)"/);
  const bounds = viewBox?.[1].trim().split(/[\s,]+/).map(Number);
  if (
    !bounds || bounds.length !== 4 || !bounds.every(Number.isFinite) ||
    bounds[2] <= 0 || bounds[3] <= 0
  ) {
    throw new Error("Expected a finite viewBox with positive width and height");
  }

  const [x, y, width, height] = bounds;
  const sizedRoot = root[0]
    .replace(/\s(?:width|height)="[^"]*"/g, "")
    .replace(/>$/, ` width="${width}" height="${height}">`);
  const canvas = `<rect data-diagram-canvas="true" x="${x}" y="${y}" width="${width}" height="${height}" fill="#ffffff" style="fill:#ffffff;stroke:none" aria-hidden="true"/>`;

  // Remove only the canvas owned by this script, so the command is idempotent.
  return source
    .replace(/<rect data-diagram-canvas="true"[^>]*\/>/g, "")
    .replace(root[0], `${sizedRoot}${canvas}`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--check")) {
    throw new Error("Usage: node scripts/prepare-diagrams.mjs [--check]");
  }
  const check = args.includes("--check");
  const directory = fileURLToPath(new URL("../docs/diagrams/", import.meta.url));
  const files = fs.readdirSync(directory).filter((name) => name.endsWith(".svg")).sort();
  let pending = 0;
  for (const name of files) {
    const file = path.join(directory, name);
    const source = fs.readFileSync(file, "utf8");
    const prepared = prepareDiagram(source);
    if (source === prepared) continue;
    pending += 1;
    if (check) console.error(`${name}: run npm run docs:prepare-diagrams`);
    else fs.writeFileSync(file, prepared);
  }
  if (check && pending > 0) process.exitCode = 1;
  else console.log(`${files.length} diagram canvases and dimensions ${check ? "checked" : "prepared"} (${pending} changed).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main();
}
