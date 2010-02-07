var
  PORT = 0xFAB,

  fab = require( "../" ),
  http = require( "http" ),
  assert = require( "assert" ),
  
  handler = function( respond ) {
    respond( "one" );
    respond( "two" );
    respond( "three" );
    respond( null );
  },
  
  unbufferedCount = 3,
  bufferedCount = 1,
  
  client = http.createClient( PORT ),
  server = http.createServer( 
  
    ( fab )
      ( "/unbuffered" )
        [ "GET" ]( handler )
      ()
      ( "/buffered" )
        ( require( "../middleware/bufferBody" ) )
        [ "GET" ]( handler )
      ()
    ( fab )
  
  );
  
server.listen( PORT );

client
  .request( "/unbuffered" )
  .finish( function( response ) {
    response
      .addListener( "body", function(){ unbufferedCount-- } )
      .addListener( "complete", function() {
        assert.equal( unbufferedCount, 0 );

        client
          .request( "/buffered" )
          .finish( function( response ) {
            response
              .addListener( "body", function(){ bufferedCount-- } )
              .addListener( "complete", function() {
                assert.equal( bufferedCount, 0 );
                server.close();
              });
          });
      });
  });