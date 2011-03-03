module.exports = function( exports, imports ) {
  var slice = Array.prototype.slice;

  return imports( function( queue ) {
    route.capture = function( write, i ) {
      return write( function( write, head ) {
        var capture = head.url.capture || [];
        return write( i >= 0 ? capture[ i ] : capture );
      });
    }
  
    return exports( route );
    
    function route( write, pattern ) {
      return queue( function( yes ) {
        return queue( function( no ) {
          return write( function( write, head, body ) {
            var app = no
              , url = head.url;
              
            url.pathname = url.pathname.replace( pattern, function() {
              app = yes;
  
              url.capture = ( url.capture || [] )
                .concat( slice.call( arguments, 1, -2 ) );
            
              return "";          
            });
              
            return app( function read( data ) {
              if ( !arguments.length ) return write;
              
              write = write.apply( this, arguments );
              return read;            
            }, head, body );
          })();
        });
      });
    }
  }, "queue" );
};