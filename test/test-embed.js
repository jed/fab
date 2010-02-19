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
    (),
  
  outsideApp =
    ( fab )
      ( "/path2", "this path will be overwritten" )
      ( "/path3", "this path will not be overwritten" )
      ( insideApp )
    ( fab ),
  
  server = http.createServer( outsideApp );
  
server.listen( PORT );

client
  .request( "/path2" )
  .addListener( "response", function( response ) {
    var body = "";
    response
      .addListener( "data", function( data ){ body += data } )
      .addListener( "end", function() {
        assert.equal( body, "this path will overwrite" )
        server.close();
      });
  })
  .close();
  