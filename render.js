module.exports = function( exports ) {
  return exports( function( write ) {
    var args = [].slice.call( arguments );

    return function read( obj ) {
      if ( obj && obj.apply ) {
        args[ 0 ] = read;
        return obj.apply( undefined, args );
      }

      write = write.apply( undefined, arguments );

      return arguments.length ? read : write;
    }
  });
}