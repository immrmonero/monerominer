var puppeteer = require('puppeteer');

function delay() {
  return new Promise((resolve) => {
  setTimeout(resolve, 1000);
  });
}

(async() => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('https://authedmine.com/media/miner.html?key=9vufBAZVFa4oizIODxRrBfuEkVWR69d5', {waitUntil: 'networkidle2'});
  await page.waitForSelector('#mining-start');
  await page.click('#mining-start');
  await delay().then(() => {
  console.log('Miner Started');
    setInterval(() => {
      page.evaluate(() => {
        return {
          totalHash: document.querySelector('#hashes-total').innerText,
          hashesPerSecond: document.querySelector('#hashes-per-second').innerText
        };
      }).then((hashes) => {
        console.log(`Hashes/sec: ${hashes.hashesPerSecond}/s Total Hashes: ${hashes.totalHash}`);
      });
    }, 1000);
  });
})();

