fab = require( "../" );

require( "http" ).createServer(

  fab

  ( fab.nodejs )
  
  ( fab.contentLength )
  ( fab.stringify )
  
  ( /\/date/ )
    ( fab.tmpl, "The date is <%= this.toDateString() %>." )
    ()

  ( /\/time/ )
    ( fab.tmpl, "The time is <%= this.toTimeString() %>." )
    ()
  
  ( new Date )

).listen( 0xFAB );