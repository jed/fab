(fab) - a modular async web framework
=====================================

    fab = require( "../" );
    
    require( "http" ).createServer(
    
      fab
    
      ( fab.nodejs )
      
      ( /\/hello/ )
      
        ( fab.tmpl, "Hello, <%= this %>!" )
    
        ( /\/(\w+)/ )
          ( function() {
            var out = this;
            return function( head ) {
              out({ body: head.url.capture[ 0 ] })();
            }
          })
          
        ( "world" )
      
      ( 404 )
    
    ).listen( 0xFAB );