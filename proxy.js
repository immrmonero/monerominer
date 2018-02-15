var SProxy = require("web-socket-proxy");
var proxy = new SProxy({
  host: "etn-pool.proxpool.com",
  port: 3333,
  address: 'etnkEhFkLYk1r3DGFYc6nFKisTUbv51DxARtf6cZeXV8CqBwXaZhazGBpfEkEpAYEnTYCMwBKupddE5QZLBhNQsa5waXtghSwB'
});

proxy.listen(8892);
