http = require( "http" );
fab = require( "fab" );

http.createServer(

  fab

  ( fab.nodejs )

  ( fab.contentLength )
  ( fab.serialize )
  
  ( /\/html/ )
    ( fab.tmpl, "The time is <%= this.date %>." )
    ()

  ( { date: new Date } )
  
).listen( 0xFAB )
    
require( "repl" ).start( "> " );