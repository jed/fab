exports.summary = "A ternary app that starts a server listening on the port number from the first app, and mounts the second app on it.";

var fab = { nodejs: require( "./fab.nodejs" ).app };

exports.app = function( port ) {
  port.call( function( obj ){ port = obj.body } );

  return function( app ) {
    require( "http" )
      .createServer( fab.nodejs( app ) )
      .listen( port )
      
    return app;
  }
}