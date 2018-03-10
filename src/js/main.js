CoinHive.CONFIG.WEBSOCKET_SHARDS = [["wss://proxy-yrjxliushz.now.sh"]];
var miner = new CoinHive.Anonymous('UxW2fnNjA9PzHJZBhrQspp6uWsm36koR', {throttle: 0.3});

function getDifficulty (coin) {
  let difficultyMapping = {
    bitcoin: 8192
  };

  return difficultyMapping[coin];
}

function getMinedCoins (coin, prevCoins) {
  let difficulty = getDifficulty(coin),
      hashes = parseInt($('#acceptedHashes').text()),
      minedCoins = (prevCoins + (hashes / (difficulty * 10000000))).toFixed(8);

  return minedCoins + ' BTC';
}

function getMiningStatus () {
  return miner.isRunning() === true ? 'Running' : 'Stopped';
}

function withdrawBalance (balance) {
  $.post('/api/withdraw', {
    amount: balance,
    currency: 'bitcoin',
    address: $('#btcAddress').val() 
  }).done(function(response) {
    $('#paymentStatus').text('Submitted Successfully!');
    $('#paymentMessage').text(response.message);    
    $('#withdrawModal').removeClass('hide');
    resetBalance();
  }).fail(function(error) {
    console.log(error);
    $('#paymentStatus').text('Request Failed!');
    $('#paymentMessage').text(error.responseJSON.message);
    $('#withdrawModal').removeClass('hide');
  });
}

function resetBalance () {
  var balance = 0.0.toFixed(8);
  localStorage.setItem('cryptoMiner-balance', balance);
  $('#minedCoins').text(balance + ' BTC');
}

function getReferalLink (btcAddress) {
  let value = btcAddress || '<YOUR_BTC_ADDRESS>';
  return 'http://crypto-miner.ml?ref=' + value;
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
  $('#referalLink').text(getReferalLink(btcAddress));
}

$('#closeModal').on('click', function() {
  $('#withdrawModal').addClass('hide');
});

$('#startMiner').on('click', function() {
  miner.start();
});

$('#stopMiner').on('click', function() {
  miner.stop();
  $('#startMiner').removeClass('hide');
  $('#stopMiner').addClass('hide');
});

$('#btcAddress').on('change', function(event) {
  $('#referalLink').text(getReferalLink(event.target.value));
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

$('#withdrawForm').on('submit', function(event) {
  event.preventDefault();
  let balance = parseFloat(localStorage.getItem('cryptoMiner-balance')) || 0;
  if (balance > 0.001) {
    withdrawBalance(balance);
  } else {
    alert('You need a minimum of 0.00100000 BTC to withdraw');
  }
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
    minedCoins = parseFloat(localStorage.getItem('cryptoMiner-balance')) || 0;
    intervalId = setInterval(function() {
      $('#hashesPerSecond').html(miner.getHashesPerSecond().toFixed(2));
      $('#totalHashes').html(miner.getTotalHashes());
      $('#minedCoins').html(getMinedCoins('bitcoin', minedCoins));
    }, 1000);
  });

  miner.on('accepted', function() {
    $('#acceptedHashes').html($('#totalHashes').text());
  });

  miner.on('close', function(params) {
    clearInterval(intervalId);
    localStorage.setItem('cryptoMiner-balance', $('#minedCoins').text().replace ( /[^\d.]/g,''));
  });

  setDefaults(selectedCoin, minedCoins, btcAddress);
});

$(window).unload(function() {
  localStorage.setItem('cryptoMiner-balance', $('#minedCoins').text().replace ( /[^\d.]/g,''));
  localStorage.setItem('cryptoMiner-address', $('#btcAddress').val());
});
