p = require( "sys" ).p
http = require( "http" );
fab = require( "../../" );

app = fab

()
  ( fab.listener )

  ( "/a" )
    ( "/a" )
      ( "/a/a path" )
    ()
  ()

  ( "/b", "/b path" )

  ( "/c", "/c", function( back ) {
    return function( head ) {
      back({ body: JSON.stringify( head.url ) })()    
    }
  })
  
  ( "/d", fab.method( "GET", "POST" ), "YEP!" )

  ( "/e/", /(\w{2})(\w{2})/, function( back ) {
    return function( head ) {
      back({ body: JSON.stringify( head.url.capture ) })()    
    }
  })

()

http.createServer( app ).listen( 8000 )

require( "repl" ).start( "> " )