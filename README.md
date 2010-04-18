(fab) - a modular async web framework
=====================================

(fab) is a lightweight toolkit that makes it easy to build asynchronous web apps. It takes advantage of the flexibility and functional nature of javascript to create a concise "DSL", without pre-compilation or magic scope hackery.

Here's an example of a "hello world" app:

    fab = require( "../" );
    
    require( "http" ).createServer( fab
    
      ( /^\/hello/ )
      
        ( fab.tmpl, "Hello, <%= this[ 0 ] %>!" )
    
        ( /^\/(\w+)$/ )
          ( fab.capture )
          ( [ "world" ] )
      
      ( 404 )
    
    ).listen( 0xFAB );
    
See [more examples](http://github.com/jed/fab/tree/master/examples/), learn how to [make your own apps](http://wiki.github.com/jed/fab/fab-app-specification), or see the [apps that (fab) provides for you](http://wiki.github.com/jed/fab/built-in-fab-apps).