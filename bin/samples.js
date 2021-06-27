#!/usr/bin/env node

const { generateAvatar } = require("../src/index");
const fs = require("fs");
const path = require("path");

const sampleDir = path.join(__dirname, "..", "sample");

function saveImage(svg, filename) {
  fs.writeFile(filename, svg, (err) => {
    if (err) console.error(err);
    else console.log(`Wrote ${filename}`);
  });
}

for (let i = 0; i < 10; i++) {
  const { svg } = generateAvatar({ gender: "male" });
  const filename = path.join(sampleDir, `male_${i + 1}.svg`);
  saveImage(svg, filename);
}

for (let i = 0; i < 10; i++) {
  const { svg } = generateAvatar({ gender: "female" });
  const filename = path.join(sampleDir, `female_${i + 1}.svg`);
  saveImage(svg, filename);
}
