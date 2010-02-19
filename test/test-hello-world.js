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
  .addListener( "response", function( response ) {
    var body = "";
    response
      .addListener( "data", function( data ) { body += data })
      .addListener( "end", function() {
        assert.equal( body, "hello world." );
        server.close();
      });
  })
  .close();
