(fab) - a streaming javascript framework
========================================

NOTE: (fab) is no longer under development.

(fab) is a lightweight toolkit that makes it easy to build asynchronous web apps. It takes advantage of the flexibility and functional nature of javascript to create a concise "DSL", without pre-compilation or magic scope hackery.

Here's an example of a "hello world" app:

    module.exports = function( exports, imports ) {
      return imports( function( run, node$listen, route, html ) {
        with ( html ) return run
        
        ()
          ( node$listen, 0xFAB )
          
          ( HTML )
            ( BODY, { id: "show" } )
              ( "Hello, " )
              
              ( EM )
                ( route, /^\/(\w+)$/ )
                  ( route.capture, 0 )
                ( /* else */ )
                  ( "world!" )
              () //EM
              
              ( "!" )
            () //BODY
          () //HTML
        ();
      })
    }
    
## Getting started 
    
To install (fab), use [npm](github.com/isaacs/npm):

    npm install fab
 
Then, from the (fab) directory in your node folder, launch the `demo.js` example:

    fab demo.js
    
Look in the source of the demo to see how the app was built.
