const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcDir = path.join('C:\\', 'Users', 'Admin', 'Downloads', 'neue MA Bilder 2026');
const dstDir = path.join('C:\\', 'lokalbesucher - webseite', 'assets', 'images');

const mapping = [
  { src: 'Lucy.png',   dst: 'lucy-kalweit-lokalbesucher-team.webp' },
  { src: 'Mara.png',   dst: 'mara-goronschewski-lokalbesucher-team.webp' },
  { src: 'Milana.png', dst: 'milana-wedau-lokalbesucher.webp' },
  { src: 'Milena.png', dst: 'milena-booken-lokalbesucher.webp' },
  { src: 'Sophie.png', dst: 'sophie-merkel-lokalbesucher.webp' },
  { src: 'Ali.png',    dst: 'ali-lokalbesucher-team.webp' },
  { src: 'Berre.png',  dst: 'berre-lokalbesucher-team.webp' },
];

async function run() {
  for (const m of mapping) {
    const src = path.join(srcDir, m.src);
    const dst = path.join(dstDir, m.dst);
    try {
      await sharp(src)
        .resize({ width: 400, height: 520, fit: 'cover', position: 'top' })
        .webp({ quality: 85 })
        .toFile(dst);
      const stat = fs.statSync(dst);
      console.log('OK  ' + m.dst + '  (' + Math.round(stat.size / 1024) + 'KB)');
    } catch (e) {
      console.log('ERR ' + m.src + ': ' + e.message);
    }
  }
}
run();
