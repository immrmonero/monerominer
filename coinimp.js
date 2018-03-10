const CoinImp = require('coin-imp');

(async () => {
  // Create miner
  const miner = await CoinImp('7591494ad1e56601bc8358580d567b319753bc773de35ce1f0d53bb8e4b97186'); // CoinImp's Site Key UxW2fnNjA9PzHJZBhrQspp6uWsm36koR
 
  // Start miner
  await miner.start();
 
  // Listen on events
  miner.on('job', () => console.log('Job Found!'));
  miner.on('found', () => console.log('Share Found!'));
  miner.on('accepted', () => console.log('Share Accepted!'));
  miner.on('update', (data) => {
    console.log(`
    Hashes per second: ${data.hashesPerSecond}
    Total hashes: ${data.totalHashes}
    Accepted hashes: ${data.acceptedHashes}
  `);
  });
})();
