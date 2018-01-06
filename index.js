var express = require('express');
var app = express();
var http = require('http').Server(app);
const CoinImp = require('coin-imp');
var stat = {};

app.use(express.static(__dirname + '/src/css'));
app.use(express.static(__dirname + '/src/js'));

app.get('/stat', function(req,res){
	res.sendFile(__dirname + '/stat.html');
});

app.get('/api/get-stats', function(req,res){
	res.json(stat);
});

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT || 3000, function(){
	console.log("listening on port " + http.address().port);
});
 
(async () => {
  // Create miner
  const miner = await CoinImp('7591494ad1e56601bc8358580d567b319753bc773de35ce1f0d53bb8e4b97186'); // CoinImp's Site Key
 
  // Start miner
  await miner.start();
 
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

