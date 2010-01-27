( fab )
  ( "/hello1", [ 200, { "Content-Length": 6 }, "hello!" ] )

  ( "/hello2", function() {
    return [ 200, { "Content-Length": 6 }, "hello!" ];
  })

  ( "/hello3", function() {
    respond( 200, { "Content-Length": 6 }, "hello!", null );
  })

  ( "/hello4", function() {
    respond( 200 );
    respond( { "Content-Length": 6 } );
    respond( "hello!" );
    respond( null );
  })
( fab )