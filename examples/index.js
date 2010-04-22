fab = require( "../" );

require( "http" ).createServer( fab
  
  ( fab.nodejs )

  ( /^\/hello/, require( "./hello" ) )
  ( /^\/focus/, require( "./focus" ) )
  ( /^\/date/, require( "./date" ) )

  ( 404 )
    
).listen( 0xFAB );