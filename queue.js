module.exports = function( exports ) {
  return exports( function( write, queue ) {
    queue = queue || [];

    var length = queue.length;

    function drain( write, req ) {
      for ( var i = 0; i < length; ) {
        write = write.apply( undefined, queue[ i++ ] );
      }

      return write();
    };

    return function read() {
      if ( !arguments.length ) return write ? write( drain ) : drain;

      queue[ length++ ] = arguments;
      return read;
    }
  })
}