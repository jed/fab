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

  ( "/c", "/c", "/c/c path" )

()

http.createServer( app ).listen( 4011 )
require( "repl" ).start( "> " )