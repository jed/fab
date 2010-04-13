fab = require( "../" );

require( "http" ).createServer( fab
  
  ( fab.nodejs )

  ( /^\/browserFocus/, require( "./browserFocus" ) )
  ( /^\/helloWorld/, require( "./helloWorld" ) )
  ( /^\/dateTime/, require( "./dateTime" ) )
  
  ( 404 )
    
).listen( 0xFAB );