$.ajax({
  url:'/api/get-stats',
  method: 'get',
  success: function(data) {
	  $('#hashesPerSecond').html(data.hashesPerSecond);
	  $('#totalHashes').html(data.totalHashes);
	  $('#acceptedHashes').html(data.acceptedHashes);
    $('#threads').html(data.threads);
  },
  error: function(err) {
    console.log('error fetching stats');
  }
});
