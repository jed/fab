with ( require( "../" ) )

( fab )
  
  ( listen( 0xFAB ) )
  
  ( /^\/hello/, require( "./hello" ) )
  ( /^\/focus/, require( "./focus" ) )
  ( /^\/date/, require( "./date" ) )
  
  ( 404 );