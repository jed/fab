// buffers the body, sending at once upon finish
module.exports = function( handler ) {
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