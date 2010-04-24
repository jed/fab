exports.summary = "A binary app that mounts the current app on a server listening on the specified port.";

var fab = { nodejs: require( "./fab.nodejs" ).app };

exports.app = function( port ) {
  port = +port
  return function( app ) {
    require( "http" )
      .createServer( fab.nodejs( app ) )
      .listen( port )
      
    return app;
  }
}