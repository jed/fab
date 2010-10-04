module.exports = function( exports, imports ) {
  var http = require( "http" );

  return imports( function( stream, listener ) {
    return exports( function( write, server ) {
      if ( !( server instanceof http.Server ) ) {
        var where = server;
        server = http.createServer();
        server.listen( where );
      }
      
      return stream( function( upstream ) {
        upstream( listener( function( listener ) {
          server.on( "request", listener );
        }))
    
        return upstream( write );
      });
    });
  }, "stream", "node/listener" );
}