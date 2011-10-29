module.exports = function( exports, imports ) {
  return imports( function( queue ) {
    return exports( function( write, duration ) {
      return write( function( write ) {
        return queue( function( rest ) {
          setTimeout(
            function(){ return rest( write ) },
            duration || 0
          );
        });
      });
    });
  }, "queue" );
}