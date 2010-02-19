var
  PORT = 0xFAB,

  fab = require( "../" ),
  http = require( "http" ),
  assert = require( "assert" ),
  
  client = http.createClient( PORT ),
  server = http.createServer( 
  
    ( fab )( fab )
  
  );
  
server.listen( PORT );

client
  .request( "/" )
  .addListener( "response", function( response ) {
    assert.equal( response.statusCode, 404 );
    server.close();
  })
  .close();