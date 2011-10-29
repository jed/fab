module.exports = function( exports ) {
  return exports( function( write, msg ) {
    if ( msg ) {
      console.log( msg );
      return write;
    }

    return function read( body ) {
      console.log( body );
      write = write.apply( undefined, arguments );
      return arguments.length ? read : write;
    }
  })
}