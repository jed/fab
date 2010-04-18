fab = require( "../" );

require( "http" ).createServer( fab
  
  ( fab.nodejs )

  ( /^\/focus/, require( "./focus" ) )
  ( /^\/hello/, require( "./hello" ) )
  ( /^\/date/, require( "./date" ) )
  
  ( 404 )
    
).listen( 0xFAB );