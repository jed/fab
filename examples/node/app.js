p = require( "sys" ).p
http = require( "http" );
fab = require( "../../" );

app = fab

()
  ( fab.listener )
  
  ( fab.basicAuth(
    "Welcome to (fab)",
    function( user, pass ){ return pass == "sesame" }
  ))

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
  
  ( "/GETorPOST", fab.method( "GET", "POST" ), "OK" )
  ( "/GET", fab.method.GET, "OK" )

  ( "/e/", /(\w{2})(\w{2})/, function( back ) {
    return function( head ) {
      back({ body: JSON.stringify( head.url.capture ) })()    
    }
  })

()

http.createServer( app ).listen( 0xFAB )

require( "repl" ).start( "> " )