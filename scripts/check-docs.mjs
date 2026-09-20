import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", ".next", ".open-next", "node_modules"]);
const markdownFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name.endsWith(".md")) markdownFiles.push(fullPath);
  }
}

function relative(filePath) {
  return path.relative(root, filePath);
}

function localisedPartner(filePath) {
  if (path.basename(filePath) === "README.md") {
    return path.join(path.dirname(filePath), "README.zh-Hant.md");
  }

  return filePath.replace(/\.md$/, ".zh-Hant.md");
}

function englishPartner(filePath) {
  return filePath.replace(/\.zh-Hant\.md$/, ".md");
}

function markdownStructure(source) {
  return {
    headingLevels: [...source.matchAll(/^(#{1,6}) /gm)].map(
      (match) => match[1].length,
    ),
    imageCount: [...source.matchAll(/!\[[^\]]*\]\([^)]+\)/g)].length,
    tableRowCount: [...source.matchAll(/^\|.*\|\s*$/gm)].length,
    detailsCount: [...source.matchAll(/<details>/g)].length,
  };
}

function sameStructure(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function stripLinkTarget(rawTarget) {
  let target = rawTarget.trim();
  if (target.startsWith("<") && target.endsWith(">")) {
    target = target.slice(1, -1);
  }

  return decodeURI(target.split("#")[0].split("?")[0]);
}

walk(root);

const errors = [];
const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
let bilingualPairCount = 0;

for (const sourceFile of markdownFiles) {
  const source = fs.readFileSync(sourceFile, "utf8");

  for (const match of source.matchAll(linkPattern)) {
    const rawTarget = match[1].trim();
    if (/^(?:https?:|mailto:|#)/.test(rawTarget)) continue;

    const cleanTarget = stripLinkTarget(rawTarget);
    if (!cleanTarget) continue;

    const targetPath = path.resolve(path.dirname(sourceFile), cleanTarget);
    if (!fs.existsSync(targetPath)) {
      errors.push(`${relative(sourceFile)} links to missing target ${rawTarget}`);
      continue;
    }

    if (!sourceFile.endsWith(".zh-Hant.md")) continue;

    // Every translated page may link back to its own English partner in the
    // language switcher. Other prose links should stay in Traditional Chinese
    // whenever a localised partner exists.
    const ownEnglishPartner = sourceFile.replace(/\.zh-Hant\.md$/, ".md");
    if (targetPath === ownEnglishPartner) continue;

    const targetStat = fs.statSync(targetPath);
    if (targetStat.isDirectory()) {
      const translatedReadme = path.join(targetPath, "README.zh-Hant.md");
      if (fs.existsSync(translatedReadme)) {
        errors.push(
          `${relative(sourceFile)} links to ${rawTarget}, but that directory has README.zh-Hant.md`,
        );
      }
      continue;
    }

    if (!targetPath.endsWith(".md") || targetPath.endsWith(".zh-Hant.md")) continue;

    const translatedTarget = localisedPartner(targetPath);
    if (fs.existsSync(translatedTarget)) {
      errors.push(
        `${relative(sourceFile)} links to ${rawTarget}; use ${path.relative(path.dirname(sourceFile), translatedTarget)}`,
      );
    }
  }
}

for (const englishFile of markdownFiles.filter(
  (filePath) => !filePath.endsWith(".zh-Hant.md"),
)) {
  const translatedFile = localisedPartner(englishFile);
  if (!fs.existsSync(translatedFile)) {
    errors.push(`${relative(englishFile)} has no Traditional Chinese partner`);
    continue;
  }

  bilingualPairCount += 1;
  const englishStructure = markdownStructure(
    fs.readFileSync(englishFile, "utf8"),
  );
  const translatedStructure = markdownStructure(
    fs.readFileSync(translatedFile, "utf8"),
  );
  if (!sameStructure(englishStructure, translatedStructure)) {
    errors.push(
      `${relative(englishFile)} and ${relative(translatedFile)} have different heading, image, table-row or details-block structure`,
    );
  }
}

for (const translatedFile of markdownFiles.filter((filePath) =>
  filePath.endsWith(".zh-Hant.md"),
)) {
  const partner = englishPartner(translatedFile);
  if (!fs.existsSync(partner)) {
    errors.push(`${relative(translatedFile)} has no English partner`);
  }
}

const englishReadme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const chineseReadme = fs.readFileSync(path.join(root, "README.zh-Hant.md"), "utf8");
const sectionPattern = /<!-- section:[^>]+-->/g;
const englishSections = englishReadme.match(sectionPattern) ?? [];
const chineseSections = chineseReadme.match(sectionPattern) ?? [];

if (JSON.stringify(englishSections) !== JSON.stringify(chineseSections)) {
  errors.push("README.md and README.zh-Hant.md section markers do not match");
}

const diagramDirectory = path.join(root, "docs/diagrams");
const diagramFiles = new Set(fs.readdirSync(diagramDirectory));
let diagramSetCount = 0;

for (const fileName of diagramFiles) {
  if (!fileName.endsWith(".mmd") || fileName.endsWith(".zh-Hant.mmd")) continue;

  diagramSetCount += 1;
  const stem = fileName.replace(/\.mmd$/, "");
  for (const requiredFile of [
    `${stem}.zh-Hant.mmd`,
    `${stem}.svg`,
    `${stem}.zh-Hant.svg`,
  ]) {
    if (!diagramFiles.has(requiredFile)) {
      errors.push(
        `docs/diagrams/${fileName} is missing partner docs/diagrams/${requiredFile}`,
      );
    }
  }
}

for (const fileName of diagramFiles) {
  if (fileName.endsWith(".zh-Hant.mmd")) {
    const englishFile = fileName.replace(/\.zh-Hant\.mmd$/, ".mmd");
    if (!diagramFiles.has(englishFile)) {
      errors.push(
        `docs/diagrams/${fileName} has no English Mermaid partner`,
      );
    }
  } else if (fileName.endsWith(".zh-Hant.svg")) {
    const englishSource = fileName.replace(/\.zh-Hant\.svg$/, ".mmd");
    if (!diagramFiles.has(englishSource)) {
      errors.push(
        `docs/diagrams/${fileName} has no English Mermaid source`,
      );
    }
  } else if (fileName.endsWith(".svg")) {
    const englishSource = fileName.replace(/\.svg$/, ".mmd");
    if (!diagramFiles.has(englishSource)) {
      errors.push(
        `docs/diagrams/${fileName} has no matching Mermaid source`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(`Documentation checks failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Documentation checks passed: ${markdownFiles.length} Markdown files, ${bilingualPairCount} bilingual pairs, local links, structural parity, README sections and ${diagramSetCount} Mermaid/SVG diagram sets.`,
);
