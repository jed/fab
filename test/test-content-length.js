var
  PORT = 0xFAB,

  fab = require( "../" ),
  http = require( "http" ),
  assert = require( "assert" ),
  
  client = http.createClient( PORT ),
  server = http.createServer( 
  
    ( fab )
      ( require( "../middleware/addContentLength" ) )
      ( "/", "hello world." )
    ( fab )
  
  );
  
server.listen( PORT );

client
  .request( "/" )
  .finish( function( response ) {
    assert.equal( response.headers[ "content-length" ], "12" );
    server.close();
  });