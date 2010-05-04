(fab) - a modular async web framework
=====================================

(fab) is a lightweight toolkit that makes it easy to build asynchronous web apps. It takes advantage of the flexibility and functional nature of javascript to create a concise "DSL", without pre-compilation or magic scope hackery.

Here's an example of a "hello world" app:

    with ( require( "fab" ) ) 
    
    ( fab )
    
      ( listen, 0xFAB )
      
      ( /^\/hello/ )
      
        ( tmpl )
          ( "Hello, <%= this %>!" )
    
        ( /^\/(\w+)$/ )
          ( capture.at, 0 )
          ( "world" )
      
      ( 404 );
    
See [more examples](http://github.com/jed/fab/tree/master/examples/), learn how to [make your own apps](http://wiki.github.com/jed/fab/fab-app-specification), or see the [apps that (fab) provides for you](http://wiki.github.com/jed/fab/built-in-fab-apps).

Note that development on (fab) is evolving very fast, and upcoming changes will break the current API. Though with [native templating](http://gist.github.com/382827) and an [an optional parentheses-light style](http://gist.github.com/382975), they'll be worth it. Read about [what's going to change](http://gist.github.com/385361), if you'd like, or follow [@fabjs](http://twitter.com/fabjs) for updates.