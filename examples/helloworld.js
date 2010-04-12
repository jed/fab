fab = require( "../" );

require( "http" ).createServer(

  fab

  ( fab.nodejs )
  
  ( /\/hello/ )
  
    ( fab.tmpl, "Hello, <%= this[ 0 ] %>!" )

    ( /\/(\w+)/ )
      ( capture )
      ( [ "world" ] )
  
  ( 404 )

).listen( 0xFAB );

function capture() {
  var out = this;
  return function( head ) {
    out({ body: head.url.capture })();
  }
}