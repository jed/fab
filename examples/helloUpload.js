( fab )
  ( "/hello" )
    [ "POST" ]( function( respond ) {
      var buffer = "";
      return function( data ) {
        if ( data !== null ) buffer += data;
        else respond( buffer.length + " characters sent", null );
      }
    })
  ()
( fab )