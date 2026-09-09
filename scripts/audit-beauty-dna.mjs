import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const progressPath = path.join(root, "public/beauty-dna-package/matrix/progress.json");
const progress = JSON.parse(fs.readFileSync(progressPath, "utf8"));

const expected = {
  hair: {
    ext: [".webp", ".png"],
    groups: [
      ["Short", "Medium", "Long"],
      ["Straight", "Soft Waves", "Defined Waves", "Curls", "Blowout"],
      ["Black", "Blonde", "Copper", "Dark Brown", "Light Brown", "Light Brown + Highlights", "Balayage", "Dark Brown + Almond Highlights"],
    ],
  },
  nails: {
    ext: [".webp", ".png", ".jpg", ".jpeg"],
    groups: [
      ["Short", "Medium", "Long"],
      ["Round", "Oval", "Square", "Almond", "Coffin"],
      ["Red", "French", "Burgundy", "Funny Bunny", "Mocha Chrome"],
    ],
  },
  lashes: {
    ext: [".webp", ".png", ".jpg", ".jpeg"],
    groups: [
      ["Natural", "Cat Eye", "Wispy"],
      ["Classic", "Greek", "Hybrid", "Mega"],
      ["Short", "Medium", "Long"],
    ],
  },
  brows: {
    ext: [".webp", ".png", ".jpg", ".jpeg"],
    groups: [
      ["Soft", "Straight", "Natural Arch", "Defined", "High Arch"],
      ["Thin", "Medium", "Thick"],
      ["Light Brown", "Brown", "Dark Brown", "Black"],
    ],
  },
};

function slug(value) {
  return value
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cartesian(groups) {
  return groups.reduce((sets, group) => sets.flatMap((prefix) => group.map((value) => [...prefix, value])), [[]]);
}

function hasFile(category, key, extensions) {
  return extensions.some((ext) => fs.existsSync(path.join(root, "public/beauty-dna-package/matrix", category, `${key}${ext}`)));
}

const report = {};
let totalDone = 0;
let totalExpected = 0;

for (const [category, config] of Object.entries(expected)) {
  const required = cartesian(config.groups).map((combo) => combo.map(slug).join("/"));
  const present = required.filter((key) => hasFile(category, key, config.ext));
  const missing = required.filter((key) => !hasFile(category, key, config.ext));
  const recorded = progress.completed?.[category] || [];
  report[category] = {
    expected: required.length,
    presentFiles: present.length,
    recordedComplete: recorded.length,
    missingFiles: missing,
    presentButNotRecorded: present.filter((key) => !recorded.includes(key)),
    recordedButMissing: recorded.filter((key) => !present.includes(key)),
  };
  totalDone += present.length;
  totalExpected += required.length;
}

console.log(JSON.stringify({
  total: { expected: totalExpected, presentFiles: totalDone, missingFiles: totalExpected - totalDone },
  categories: report,
}, null, 2));
