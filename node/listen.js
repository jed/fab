module.exports = function( exports, imports ) {
  return imports( function( stream, listener ) {
    return exports( function( write, port ) {
      return stream( function( upstream ) {
        upstream( listener( function( listener ) {
          require( "http" )
            .createServer( listener )
            .listen( port );    
        }))
    
        return upstream( write );
      });
    });
  }, "stream", "node/listener" );
}