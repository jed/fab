function addContentLength( handler ) {
  return function( respond ) {
    handler.call( this, function( data ) {
      if ( fab.isString( data ) )
        respond( { "Content-Length": process._byteLength( data ) } );
          
      respond( data );
    })
  };
}

function bufferBody( handler ) {
  return function( respond ) {
    var body = "";

    handler.call( this, function( data ) {
      if ( fab.isString( data ) ) body += data;
      else {
        if ( data == null ) respond( body );
        respond( data );
      }
    })
  };
}

( fab )
  ( bufferBody )
  ( addContentLength )
  ( "/hello", [ 200, { "Content-Type": "text/plain" }, "hello!" ] )
( fab )