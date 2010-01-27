( fab )
  ( "/hello", function( respond ) {
    setTimeout( function() {
      respond( "hello, sorry to make you wait!", null );
    }, 2000 );
  })
( fab )