exports.name      = "fab.method.PUT";
exports.summary   = "Shortcut for fab.method( 'PUT' ).";
exports.requires  = [ "fab.method" ];

var fab = { method: require( "./fab.method" ).app };

exports.app = fab.method( "PUT" )