const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const src = path.join('C:\\', 'Users', 'Admin', 'Downloads', 'neue MA Bilder 2026', 'Lucy.png');
const dst = path.join('C:\\', 'lokalbesucher - webseite', 'assets', 'images', 'lucy-kalweit-lokalbesucher-team.webp');

sharp(src)
  .resize({ width: 400, height: 520, fit: 'cover', position: 'top' })
  .webp({ quality: 87 })
  .toFile(dst)
  .then(() => {
    const stat = fs.statSync(dst);
    console.log('OK: ' + Math.round(stat.size / 1024) + 'KB');
  });
