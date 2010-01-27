fab = require( "../../fab" );
http = require( "http" );

http.createServer(

  ( fab )
    ( "/hello", "hello!" )
  ( fab )

).listen( 4011 );