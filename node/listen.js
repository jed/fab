module.exports = function( exports, imports ) {
  var http = require( "http" );

  return imports( function( queue, listener ) {
    return exports( function( write, server ) {
      if ( !( server instanceof http.Server ) ) {
        var where = server;
        server = http.createServer();
        server.listen( where );
      }

      return queue( function( upstream ) {
        upstream( listener( function( listener ) {
          server.on( "request", listener );
        }))

        return upstream( write );
      });
    });
  }, "queue", "node/listener" );
}