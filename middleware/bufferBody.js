// buffers the body, sending at once upon finish
module.exports = function( handler ) {
  require("sys").puts( "middleware init" );
  return function( respond ) {
    require("sys").puts( "middleware called" );
    var body = "";

    handler.call( this, function( data ) {
      require("sys").puts( "data: " + data );
      if ( fab.isString( data ) ) body += data;
      else {
        if ( data == null ) respond( body );
        respond( data );
      }
    })
  };
}