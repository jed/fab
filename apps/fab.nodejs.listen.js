exports.name      = "fab.nodejs.listen";
exports.summary   = "Starts a server listening on the port number from the first app, and mounts the second app on it.";
exports.requires  = [ "fab.nodejs" ];

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