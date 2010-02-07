function addContentLength( handler ) {
  return function( respond ) {
    handler.call( this, function( data ) {
      if ( data && typeof data.body === "string" ) {
        var length = process._byteLength( data.body );

        data.headers = data.headers || {};
        data.headers[ "Content-Length" ] = length;
      }
          
      respond( data );
    })
  };
}

( fab )
  ( addContentLength )
  ( "/hello", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
    body: "hello!"
  })
( fab )