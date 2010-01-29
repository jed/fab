var
  PORT = 0xFAB,

  fab = require( "../" ),
  http = require( "http" ),
  assert = require( "assert" ),
  
  client = http.createClient( PORT ),
  server = http.createServer( 
  
    ( fab )
      ( "/", "hello world." )
    ( fab )
  
  );
  
server.listen( PORT );

client
  .request( "/" )
  .finish( function( response ) {
    var body = "";
    response
      .addListener( "body", function( data ) { body += data })
      .addListener( "complete", function() {
        assert.equal( body, "hello world." );
        server.close();
      });
  });