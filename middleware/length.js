// adds the content length header.
module.exports = function( handler ) {
  handler = fab.handler( require( "./buffer" )( handler ) );

  return function( respond ) {
    handler.call( this, function( data ) {
      if ( data && typeof data.body === "string" ) {
        var length = process._byteLength( data.body );

        data.headers = data.headers || {};
        data.headers[ "content-length" ] = length.toString( 10 );
      }
          
      respond( data );
    })
  };
}