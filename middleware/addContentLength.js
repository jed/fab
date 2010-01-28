// adds the content length header. body must already be buffered.
module.exports = function( handler ) {
  return function( respond ) {
    handler.call( this, function( data ) {
      if ( fab.isString( data ) )
        respond( { "Content-Length": process._byteLength( data ) } );
          
      respond( data );
    })
  };
}