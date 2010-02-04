var
  PORT = 0xFAB,

  fab = require( "../" ),
  http = require( "http" ),
  assert = require( "assert" ),
  
  client = http.createClient( PORT ),
  
  insideApp = 
    ( fab )
      ( "/path1", "this path will be added" )
      ( "/path2", "this path will overwrite" )
    ();
  


outsideApp =
  ( fab )
    ( "/path2", "this path will be overwritten" )
    ( "/path3", "this path will not be overwritten" )
    ( insideApp )
  ()

server = http.createServer( outsideApp( fab ) );
  
server.listen( PORT );

client
  .request( "/path2" )
  .finish( function( response ) {
    var body = "";
    response
      .addListener( "body", function( data ){ body += data } )
      .addListener( "complete", function() {
        assert.equal( body, "this path will overwrite" )
        server.close();
      });
  });