module.exports = function( exports, imports ) {
  return imports( function( stream, render ) {
    return exports( function( write ) {
      return stream( function( upstream ) {
        return write( function( write, head, body ) {
          var buffered = stream()
            , length = 0;
    
          return upstream( render( function read( body, head ) {
            buffered = buffered.apply( this, arguments );
    
            if ( !arguments.length ) return buffered(
              write( undefined, { headers: { "content-length": length } } )
            );
            
            if ( body ) length += body.length;
    
            return read;
          }, head, body ), head, body );
        })();
      });
    });
  }, "stream", "render" );
}
