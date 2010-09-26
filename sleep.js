module.exports = function( exports, imports ) {
  return imports( function( stream ) {
    return exports( function( write, duration ) {
      return write( function( write ) {
        return stream( function( rest ) {
          setTimeout(
            function(){ return rest( write ) },
            duration || 0 
          );
        });
      });
    });
  }, "stream" );
}