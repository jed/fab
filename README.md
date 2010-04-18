(fab) - a modular async web framework
=====================================

(fab) is a lightweight toolkit that makes it easy to build asynchronous web apps. It takes advantage of the flexibility and functional nature of javascript to create a concise "DSL", without pre-compilation or magic scope hackery.

Here's an example of a Hello World app:

    fab = require( "../" );
    
    require( "http" ).createServer( fab
    
      ( /^\/hello/ )
      
        ( fab.tmpl, "Hello, <%= this[ 0 ] %>!" )
    
        ( /^\/(\w+)$/ )
          ( fab.capture )
          ( [ "world" ] )
      
      ( 404 )
    
    ).listen( 0xFAB );
    
    