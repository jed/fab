var
  PORT = 0xFAB,

  fab = require( "../" ),
  http = require( "http" ),
  assert = require( "assert" ),
  
  listener = ( fab )( fab ),
  server = http.createServer( listener ),
  client = http.createClient( PORT );
  
server.listen( PORT );

client
  .request( "/" )
  .finish( function( response ) {
    assert.equal( response.statusCode, 405 );
    server.close();
  });