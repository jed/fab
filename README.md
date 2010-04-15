(fab) - a modular async web framework
=====================================

    fab = require( "../" );
    
    require( "http" ).createServer( fab
    
      ( /^\/hello/ )
      
        ( fab.tmpl, "Hello, <%= this[ 0 ] %>!" )
    
        ( /^\/(\w+)$/ )
          ( fab.capture )
          ( [ "world" ] )
      
      ( 404 )
    
    ).listen( 0xFAB );
    
    