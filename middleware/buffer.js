// buffers the body, sending at once upon finish
module.exports = function( handler ) {
  return function( respond ) {
    var body = "";

    return handler.call( this, function( data ) {
      if ( data && typeof data.body === "string" )
        body += data.body;
      
      else {
        if ( data === null )
          respond( body );

        respond( data );
      }
    })
  };
}