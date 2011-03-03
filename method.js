module.exports = function( exports, imports ) {
  return imports( function( queue ) {
    var names = "GET PUT POST DELETE HEAD".split( " " );
  
    function method( write, name ) {
      return queue( function( yes ) {
        return queue( function( no ) {
          return write( function( write, head, body ) {
            return ( head.method == name ? yes : no )( write, head, body );
          })();
        });
      });
    }
    
    for ( var i = names.length; i--; ) ( function( name ) {
      method[ name ] = function( write ) {
        return method( write, name );
      }
    })( names[ i ] );

    return exports( method );
  })
}