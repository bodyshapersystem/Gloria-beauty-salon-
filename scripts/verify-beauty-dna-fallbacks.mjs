import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const matrixRoot = path.join(root, "public/beauty-dna-package/matrix");

const choices = {
  hair: {
    length: ["short", "medium", "long"],
    texture: ["straight", "soft-waves", "defined-waves", "curls", "blowout"],
    color: ["black", "blonde", "copper", "dark-brown", "light-brown", "light-brown-plus-highlights", "balayage", "dark-brown-plus-almond-highlights"],
  },
  nails: {
    length: ["short", "medium", "long"],
    shape: ["round", "oval", "square", "almond", "coffin"],
    color: ["red", "french", "burgundy", "funny-bunny", "mocha-chrome"],
  },
  lashes: {
    design: ["natural", "cat-eye", "wispy"],
    type: ["classic", "greek", "hybrid", "mega"],
    length: ["short", "medium", "long"],
  },
  brows: {
    shape: ["soft", "straight", "natural-arch", "defined", "high-arch"],
    thickness: ["thin", "medium", "thick"],
    color: ["light-brown", "brown", "dark-brown", "black"],
  },
};

const exact = {
  hair: new Set([
    "long/straight/black", "long/straight/blonde", "long/straight/copper", "long/straight/dark-brown",
    "long/straight/light-brown", "long/straight/light-brown-plus-highlights", "long/straight/balayage",
    "long/straight/dark-brown-plus-almond-highlights", "long/soft-waves/dark-brown",
    "long/defined-waves/dark-brown", "long/curls/dark-brown", "long/blowout/dark-brown",
    "short/straight/black", "short/straight/blonde", "short/straight/copper", "short/straight/dark-brown",
    "short/straight/light-brown", "short/straight/light-brown-plus-highlights", "short/straight/balayage",
    "short/straight/dark-brown-plus-almond-highlights", "medium/straight/black", "medium/straight/blonde",
    "medium/straight/copper", "medium/straight/dark-brown", "medium/straight/light-brown",
    "medium/straight/light-brown-plus-highlights", "medium/straight/balayage",
    "medium/straight/dark-brown-plus-almond-highlights",
  ]),
  nails: new Set([
    "short/round/red", "short/round/french", "short/round/funny-bunny",
    "medium/almond/burgundy", "medium/almond/mocha-chrome", "medium/square/funny-bunny",
    "long/almond/red", "long/almond/french", "long/almond/burgundy", "long/almond/funny-bunny",
    "long/almond/mocha-chrome", "long/coffin/red", "long/coffin/funny-bunny",
  ]),
  lashes: new Set([
    "natural/classic/medium", "natural/hybrid/short", "natural/hybrid/medium", "natural/hybrid/long",
    "natural/mega/medium", "cat-eye/hybrid/medium", "wispy/greek/medium",
  ]),
  brows: new Set([
    "natural-arch/medium/dark-brown", "soft/medium/light-brown", "soft/medium/brown",
    "soft/medium/dark-brown", "soft/medium/black", "soft/thin/dark-brown", "soft/thick/dark-brown",
    "straight/medium/dark-brown", "defined/medium/dark-brown", "high-arch/medium/dark-brown",
  ]),
};

function fileExists(category, key) {
  const extensions = category === "hair" ? [".webp", ".png"] : [".webp", ".png", ".jpg", ".jpeg"];
  return extensions.some((extension) => fs.existsSync(path.join(matrixRoot, category, `${key}${extension}`)));
}

function resolveHair(length, texture, color) {
  return [
    [length, texture, color].join("/"),
    [length, "straight", color].join("/"),
    [length, texture, "dark-brown"].join("/"),
    [length, "straight", "dark-brown"].join("/"),
  ].find((key) => exact.hair.has(key));
}

function resolveNails(length, shape, color) {
  const shapeFallback = shape === "oval" ? "almond" : shape;
  const sameLength = [...exact.nails].filter((key) => key.startsWith(`${length}/`));
  return [
    [length, shape, color].join("/"),
    [length, shapeFallback, color].join("/"),
    [length, shape, "funny-bunny"].join("/"),
    [length, shapeFallback, "funny-bunny"].join("/"),
    [length, "almond", color].join("/"),
    [length, "round", color].join("/"),
  ].find((key) => exact.nails.has(key)) || sameLength.find((key) => key.endsWith(`/${color}`)) || sameLength[0];
}

function resolveLashes(design, type, length) {
  const sameDesign = [...exact.lashes].filter((key) => key.startsWith(`${design}/`));
  const fallbacks = [
    [design, type, length].join("/"),
    [design, type, "medium"].join("/"),
    [design, "hybrid", length].join("/"),
    [design, "hybrid", "medium"].join("/"),
    ["natural", type, length].join("/"),
    ["natural", "hybrid", length].join("/"),
    ["natural", "hybrid", "medium"].join("/"),
  ];
  const sameDesignMatch = sameDesign.find((key) => key.includes(`/${type}/`)) || sameDesign.find((key) => key.endsWith(`/${length}`)) || sameDesign[0];
  return fallbacks.slice(0, 4).find((key) => exact.lashes.has(key)) || sameDesignMatch || fallbacks.slice(4).find((key) => exact.lashes.has(key));
}

function resolveBrows(shape, thickness, color) {
  const sameShape = [...exact.brows].filter((key) => key.startsWith(`${shape}/`));
  return [
    [shape, thickness, color].join("/"),
    [shape, "medium", color].join("/"),
    [shape, thickness, "dark-brown"].join("/"),
    [shape, "medium", "dark-brown"].join("/"),
    ["soft", thickness, color].join("/"),
    ["soft", "medium", color].join("/"),
  ].find((key) => exact.brows.has(key)) || sameShape.find((key) => key.endsWith(`/${color}`)) || sameShape.find((key) => key.includes(`/${thickness}/`)) || sameShape[0];
}

const failures = [];

for (const length of choices.hair.length) {
  for (const texture of choices.hair.texture) {
    for (const color of choices.hair.color) {
      const resolved = resolveHair(length, texture, color);
      if (!resolved?.startsWith(`${length}/`)) failures.push(`hair reset: ${length}/${texture}/${color} -> ${resolved}`);
      if (resolved && !fileExists("hair", resolved)) failures.push(`hair missing file for fallback: ${resolved}`);
    }
  }
}

for (const length of choices.nails.length) {
  for (const shape of choices.nails.shape) {
    for (const color of choices.nails.color) {
      const resolved = resolveNails(length, shape, color);
      if (!resolved?.startsWith(`${length}/`)) failures.push(`nails reset: ${length}/${shape}/${color} -> ${resolved}`);
      if (resolved && !fileExists("nails", resolved)) failures.push(`nails missing file for fallback: ${resolved}`);
    }
  }
}

for (const design of choices.lashes.design) {
  for (const type of choices.lashes.type) {
    for (const length of choices.lashes.length) {
      const resolved = resolveLashes(design, type, length);
      const hasSameDesign = [...exact.lashes].some((key) => key.startsWith(`${design}/`));
      if (hasSameDesign && !resolved?.startsWith(`${design}/`)) failures.push(`lashes design reset: ${design}/${type}/${length} -> ${resolved}`);
      if (resolved && !fileExists("lashes", resolved)) failures.push(`lashes missing file for fallback: ${resolved}`);
    }
  }
}

for (const shape of choices.brows.shape) {
  for (const thickness of choices.brows.thickness) {
    for (const color of choices.brows.color) {
      const resolved = resolveBrows(shape, thickness, color);
      const hasSameShape = [...exact.brows].some((key) => key.startsWith(`${shape}/`));
      if (hasSameShape && !resolved?.startsWith(`${shape}/`)) failures.push(`brows shape reset: ${shape}/${thickness}/${color} -> ${resolved}`);
      if (resolved && !fileExists("brows", resolved)) failures.push(`brows missing file for fallback: ${resolved}`);
    }
  }
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  checked: {
    hair: choices.hair.length.length * choices.hair.texture.length * choices.hair.color.length,
    nails: choices.nails.length.length * choices.nails.shape.length * choices.nails.color.length,
    lashes: choices.lashes.design.length * choices.lashes.type.length * choices.lashes.length.length,
    brows: choices.brows.shape.length * choices.brows.thickness.length * choices.brows.color.length,
  },
}, null, 2));

