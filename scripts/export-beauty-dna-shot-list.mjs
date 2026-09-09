import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const matrixRoot = path.join(root, "public/beauty-dna-package/matrix");
const outDir = path.join(root, "docs");
const jsonOut = path.join(outDir, "beauty-dna-shot-list.json");
const csvOut = path.join(outDir, "beauty-dna-shot-list.csv");

const categories = {
  hair: {
    labels: ["length", "texture", "color"],
    extensions: [".webp", ".png"],
    groups: [
      ["short", "medium", "long"],
      ["straight", "soft-waves", "defined-waves", "curls", "blowout"],
      ["black", "blonde", "copper", "dark-brown", "light-brown", "light-brown-plus-highlights", "balayage", "dark-brown-plus-almond-highlights"],
    ],
    direction:
      "Same model, front-facing salon portrait, same pose/crop/lighting for every hair combo. Real hairstyle/color result; do not fake it with a color overlay or zoom crop.",
  },
  nails: {
    labels: ["length", "shape", "color"],
    extensions: [".webp", ".png", ".jpg", ".jpeg"],
    groups: [
      ["short", "medium", "long"],
      ["round", "oval", "square", "almond", "coffin"],
      ["red", "french", "burgundy", "funny-bunny", "mocha-chrome"],
    ],
    direction:
      "Same hand, same angle, same background and lighting for every nail combo. Real manicure length/shape/color; keep the hand elegant and centered.",
  },
  lashes: {
    labels: ["design", "type", "length"],
    extensions: [".webp", ".png", ".jpg", ".jpeg"],
    groups: [
      ["natural", "cat-eye", "wispy"],
      ["classic", "greek", "hybrid", "mega"],
      ["short", "medium", "long"],
    ],
    direction:
      "Same eye crop, same eye direction, same skin tone and lighting for every lash combo. Real lash map/volume/length variation; no painted-on filter effect.",
  },
  brows: {
    labels: ["shape", "thickness", "color"],
    extensions: [".webp", ".png", ".jpg", ".jpeg"],
    groups: [
      ["soft", "straight", "natural-arch", "defined", "high-arch"],
      ["thin", "medium", "thick"],
      ["light-brown", "brown", "dark-brown", "black"],
    ],
    direction:
      "Same brow/eye crop, same face angle and lighting for every brow combo. Real brow shape/thickness/color result; avoid synthetic makeup filters.",
  },
};

function cartesian(groups) {
  return groups.reduce((sets, group) => sets.flatMap((prefix) => group.map((value) => [...prefix, value])), [[]]);
}

function hasFile(category, key, extensions) {
  return extensions.some((extension) => fs.existsSync(path.join(matrixRoot, category, `${key}${extension}`)));
}

function csvValue(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

const shotList = {
  version: 1,
  requiredTotal: 0,
  completedTotal: 0,
  missingTotal: 0,
  categories: {},
};

const csvRows = [
  ["category", "key", "expected_path", "trait_1", "trait_2", "trait_3", "direction"].map(csvValue).join(","),
];

for (const [category, config] of Object.entries(categories)) {
  const required = cartesian(config.groups).map((combo) => {
    const key = combo.join("/");
    return {
      key,
      expectedPath: `public/beauty-dna-package/matrix/${category}/${key}.webp`,
      traits: Object.fromEntries(config.labels.map((label, index) => [label, combo[index]])),
      direction: config.direction,
    };
  });
  const completed = required.filter((item) => hasFile(category, item.key, config.extensions));
  const missing = required.filter((item) => !hasFile(category, item.key, config.extensions));

  shotList.categories[category] = {
    required: required.length,
    completed: completed.length,
    missing: missing.length,
    direction: config.direction,
    missingShots: missing,
  };

  shotList.requiredTotal += required.length;
  shotList.completedTotal += completed.length;
  shotList.missingTotal += missing.length;

  for (const item of missing) {
    csvRows.push([
      category,
      item.key,
      item.expectedPath,
      item.traits[config.labels[0]],
      item.traits[config.labels[1]],
      item.traits[config.labels[2]],
      item.direction,
    ].map(csvValue).join(","));
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(jsonOut, `${JSON.stringify(shotList, null, 2)}\n`);
fs.writeFileSync(csvOut, `${csvRows.join("\n")}\n`);

console.log(JSON.stringify({
  ok: true,
  json: path.relative(root, jsonOut),
  csv: path.relative(root, csvOut),
  requiredTotal: shotList.requiredTotal,
  completedTotal: shotList.completedTotal,
  missingTotal: shotList.missingTotal,
}, null, 2));
