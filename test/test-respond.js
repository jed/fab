require('./common');

var
  PORT = 0xFAB,

  expectedCallbacks = {
    a1: 1,
    a2: 1,
    b1: 1,
    b2: 1,
  };

  client = http.createClient(PORT),
  server = http.createServer(
    (fab)
      ('/a', function(respond) {
        respond({
          body: 'test'
        });
        respond(null);
        expectedCallbacks.a1--;
      })
      ('/b', function(respond) {
        respond({
          body: 'test'
        }, null);
        expectedCallbacks.b1--;
      })
    (fab)
  ),

  timeout = setTimeout(function() {
    checkCallbacks(expectedCallbacks);
  }, 1000);
  
server.listen(PORT);

client
  .request('/a')
  .finish(function(response) {
    expectedCallbacks.a2--;
  });

client
  .request('/b')
  .finish(function(response) {
    expectedCallbacks.b2--;
    clearTimeout(timeout);
    server.close();
  });

process.addListener('exit', function() {
  checkCallbacks(expectedCallbacks);
});