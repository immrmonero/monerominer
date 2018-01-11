var express = require('express');
var app = express();
var http = require('http').Server(app);
const CoinImp = require('coin-imp');
var bodyParser = require('body-parser');
var stat = {};

app.use(express.static(__dirname + '/src/css'));
app.use(express.static(__dirname + '/src/js'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/stat', function(req,res){
	res.sendFile(__dirname + '/stat.html');
});

app.get('/terms', function(req,res){
  res.sendFile(__dirname + '/termsconditions.html');
});

app.get('/api/get-stats', function(req,res){
	res.json(stat);
});

app.post('/api/withdraw', function(req, res) {
  console.log(req.body);
  if (req.body.address && req.body.amount && parseFloat(req.body.amount) > 0.001) {
    res.status(200).json({
      status: 'Pending Verification',
      message: 'You request is being validated, once confirmed the payment will be processed. It will take around 3 - 7 working days to confirm and process the payment. \n Happy Mining!'
    });
  } else {
    res.status(400).json({
      status: 'Failed',
      message: 'Invalid request, please check the details'
    });
  }
});

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

var hostName = process.env.HOST || process.env.HOSTNAME || 'localhost';
console.log(hostName);

http.listen(process.env.PORT || 3000, function(){
	console.log("listening on port " + http.address().port);
});

(async () => {
  // Create miner
  const miner = await CoinImp('7591494ad1e56601bc8358580d567b319753bc773de35ce1f0d53bb8e4b97186', {
  	host: hostName
  }); // CoinImp's Site Key
 
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

