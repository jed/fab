// adds the content length header. body must already be buffered.
module.exports = function( handler ) {
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