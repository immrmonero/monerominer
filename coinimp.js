const CoinImp = require('coin-imp');

(async () => {
  // Create miner
  const miner = await CoinImp('UxW2fnNjA9PzHJZBhrQspp6uWsm36koR', {
  	host: hostName
  }); // CoinImp's Site Key
 
  // Start miner
  // await miner.start();
 
  // Listen on events
  miner.on('found', () => console.log('Found!'));
  miner.on('accepted', () => console.log('Accepted!'));
  miner.on('update', (data) => {
    console.log(`
    Hashes per second: ${data.hashesPerSecond}
    Total hashes: ${data.totalHashes}
    Accepted hashes: ${data.acceptedHashes}
  `)
   stat = {
   	hashesPerSecond: data.hashesPerSecond,
   	totalHashes: data.totalHashes,
   	acceptedHashes: data.acceptedHashes,
   	threads: data.threads
   };
  });
})();
