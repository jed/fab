fab.listener
------------

A binary app that converts a (fab) app into a node.js listener.

**Arity**: 2

**Arguments**: N/A

**Examples**:

    require( "http" ).createServer(
    
      require( "fab" )
      
      ()
        ( fab.listener )
        ( "Hello, world." )
      ()

    ).listen( 8000 )
