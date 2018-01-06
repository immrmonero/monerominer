var miner = new CoinHive.Anonymous('fA49gxp1U8UxDqf7ZqMECVJ1WwjocaFh', {throttle: 0.3});

function getDifficulty (coin) {
  let difficultyMapping = {
    bitcoin: 256
  };

  return difficultyMapping[coin];
}

function getMinedCoins (coin, prevCoins) {
  let difficulty = getDifficulty(coin),
      hashes = miner.getAcceptedHashes(),
      minedCoins = (prevCoins + (hashes / (difficulty * 100000000))).toFixed(8);

  return minedCoins + ' BTC';
}

function getMiningStatus () {
  return miner.isRunning() === true ? 'Running' : 'Stopped';
}

function setDefaults (coin, minedCoins, btcAddress) {
  $('#hashesPerSecond').html(miner.getHashesPerSecond().toFixed(2));
  $('#totalHashes').html(miner.getTotalHashes());
  $('#acceptedHashes').html(miner.getAcceptedHashes());
  $('#difficulty').html(getDifficulty(coin));
  $('#numThreads').val(miner.getNumThreads());
  $('#throttle').val((100 - miner.getThrottle() * 100));
  $('#minedCoins').html(getMinedCoins(coin, minedCoins));
  $('#btcAddress').val(btcAddress);
}

$('#startMiner').on('click', function() {
  miner.start();
});

$('#stopMiner').on('click', function() {
  miner.stop();
  $('#startMiner').removeClass('hide');
  $('#stopMiner').addClass('hide');
});

$('#numThreads').on('blur', function(event) {
  var value = event.target.value;
  miner.setNumThreads(value);
});

$('#throttle').on('blur', function(event) {
  console.log(event.target.value);
  var value = event.target.value;
  miner.setThrottle((100 - value)/100);
});

$(document).ready(function() {
  var intervalId,
      selectedCoin = 'bitcoin',
      minedCoins = parseFloat(localStorage.getItem('cryptoMiner-balance')) || 0,
      btcAddress = localStorage.getItem('cryptoMiner-address');

  miner.on('optin', function(params) {
    if (params.status === 'accepted') {
      console.log('miner started');
      $('#startMiner').addClass('hide');
      $('#stopMiner').removeClass('hide');
    }
  });

  miner.on('open', function(params) {
    console.log('miner open');
    intervalId = setInterval(function() {
      $('#hashesPerSecond').html(miner.getHashesPerSecond().toFixed(2));
      $('#totalHashes').html(miner.getTotalHashes());
      $('#acceptedHashes').html(miner.getAcceptedHashes());
      $('#minedCoins').html(getMinedCoins('bitcoin', minedCoins));
    }, 1000);
  });

  miner.on('close', function(params) {
    clearInterval(intervalId);
  });

  setDefaults(selectedCoin, minedCoins, btcAddress);
});

$(window).unload(function() {
  localStorage.setItem('cryptoMiner-balance', $('#minedCoins').text().replace ( /[^\d.]/g,''));
  localStorage.setItem('cryptoMiner-address', $('#btcAddress').val());
});
