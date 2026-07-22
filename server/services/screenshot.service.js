const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', '..', 'uploads', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let browserPromise = null;

async function getBrowser() {
  if (!browserPromise) {
    const puppeteer = require('puppeteer');
    browserPromise = puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browserPromise;
}

/**
 * Captura um screenshot da URL informada e salva em uploads/screenshots/<slug>.png.
 * Retorna o caminho público (ex: /uploads/screenshots/meu-projeto.png).
 */
async function captureScreenshot(url, slug) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

    const fileName = `${slug}.png`;
    const filePath = path.join(SCREENSHOTS_DIR, fileName);
    await page.screenshot({ path: filePath, type: 'png' });

    return `/uploads/screenshots/${fileName}`;
  } finally {
    await page.close();
  }
}

async function closeBrowser() {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}

module.exports = { captureScreenshot, closeBrowser };
