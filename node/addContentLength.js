module.exports = function( exports, imports ) {
  return imports( function( queue, render ) {
    return exports( function( write ) {
      return queue( function( upstream ) {
        return write( function( write, head, body ) {
          var buffered = queue()
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
  }, "queue", "render" );
}
