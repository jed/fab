( fab )
  ( "/hello" )
    [ "POST" ]( function( respond ) {
      var buffer = "";
      return function( data ) {
        if ( data !== null ) buffer += data;
        else respond( "Hello, " + buffer.length + " characters!", null );
      }
    })
  ()
( fab )