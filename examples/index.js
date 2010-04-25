var hello = require( "./hello" )
  , focus = require( "./focus" )
  , date = require( "./date" );

with ( require( "../" ) ) fab
  
  ( listen( 0xFAB ) )
  
  ( /^\/hello/, hello )
  ( /^\/focus/, focus )
  ( /^\/date/, date )
  
  ( 404 );