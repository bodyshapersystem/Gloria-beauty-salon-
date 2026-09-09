import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlPath = path.join(root, "public/beauty-dna-package/index.html");
const matrixRoot = path.join(root, "public/beauty-dna-package/matrix");
const progressPath = path.join(matrixRoot, "progress.json");

const html = fs.readFileSync(htmlPath, "utf8");
const progress = JSON.parse(fs.readFileSync(progressPath, "utf8"));

const categories = {
  hair: { setName: "exactHair", extensions: [".webp", ".png"] },
  nails: { setName: "exactNails", extensions: [".webp", ".png", ".jpg", ".jpeg"] },
  lashes: { setName: "exactLashes", extensions: [".webp", ".png", ".jpg", ".jpeg"] },
  brows: { setName: "exactBrows", extensions: [".webp", ".png", ".jpg", ".jpeg"] },
};

const expectedCombos = {
  hair: [
    ["short", "medium", "long"],
    ["straight", "soft-waves", "defined-waves", "curls", "blowout"],
    ["black", "blonde", "copper", "dark-brown", "light-brown", "light-brown-plus-highlights", "balayage", "dark-brown-plus-almond-highlights"],
  ],
  nails: [
    ["short", "medium", "long"],
    ["round", "oval", "square", "almond", "coffin"],
    ["red", "french", "burgundy", "funny-bunny", "mocha-chrome"],
  ],
  lashes: [
    ["natural", "cat-eye", "wispy"],
    ["classic", "greek", "hybrid", "mega"],
    ["short", "medium", "long"],
  ],
  brows: [
    ["soft", "straight", "natural-arch", "defined", "high-arch"],
    ["thin", "medium", "thick"],
    ["light-brown", "brown", "dark-brown", "black"],
  ],
};

function cartesian(groups) {
  return groups.reduce((sets, group) => sets.flatMap((prefix) => group.map((value) => [...prefix, value])), [[]]);
}

function readExactSet(setName) {
  const match = html.match(new RegExp(`const\\s+${setName}\\s*=\\s*new\\s+Set\\s*\\(\\s*\\[([\\s\\S]*?)\\]\\s*\\)`, "m"));
  if (!match) throw new Error(`Could not find ${setName} in ${htmlPath}`);
  return new Set([...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
}

function hasMatrixFile(category, key, extensions) {
  return extensions.some((extension) => fs.existsSync(path.join(matrixRoot, category, `${key}${extension}`)));
}

function presentRequiredFiles(category, extensions) {
  return cartesian(expectedCombos[category])
    .map((combo) => combo.join("/"))
    .filter((key) => hasMatrixFile(category, key, extensions));
}

const report = {};
const failures = [];

for (const [category, config] of Object.entries(categories)) {
  const exact = readExactSet(config.setName);
  const present = new Set(presentRequiredFiles(category, config.extensions));
  const recorded = new Set(progress.completed?.[category] || []);

  const exactMissingFile = [...exact].filter((key) => !hasMatrixFile(category, key, config.extensions));
  const presentNotExact = [...present].filter((key) => !exact.has(key));
  const progressNotExact = [...recorded].filter((key) => !exact.has(key));
  const exactNotProgress = [...exact].filter((key) => !recorded.has(key));

  report[category] = {
    exactInPage: exact.size,
    presentRequiredFiles: present.size,
    recordedComplete: recorded.size,
    exactMissingFile,
    presentNotExact,
    progressNotExact,
    exactNotProgress,
  };

  if (exactMissingFile.length) failures.push(`${category}: exact set points to missing files`);
  if (presentNotExact.length) failures.push(`${category}: matrix files are present but not listed in page exact set`);
  if (progressNotExact.length) failures.push(`${category}: progress.json includes keys not listed in page exact set`);
  if (exactNotProgress.length) failures.push(`${category}: page exact set includes keys not recorded in progress.json`);
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures, report }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, report }, null, 2));
