import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

const URL = 'https://card.resetrix.com';
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'qr');

const shared = {
  errorCorrectionLevel: 'H',
  margin: 4,
  color: { dark: '#000000', light: '#ffffff' },
};

await mkdir(outDir, { recursive: true });

const svg = await QRCode.toString(URL, { ...shared, type: 'svg' });
const svgPath = join(outDir, 'card-resetrix-com.svg');
await writeFile(svgPath, svg);

const pngPath = join(outDir, 'card-resetrix-com.png');
await QRCode.toFile(pngPath, URL, { ...shared, type: 'png', width: 2048 });

console.log(`Wrote ${svgPath}`);
console.log(`Wrote ${pngPath}`);
