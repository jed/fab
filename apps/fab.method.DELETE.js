exports.name      = "fab.method.DELETE";
exports.summary   = "Shortcut for fab.method( 'DELETE' ).";
exports.requires  = [ "fab.method" ];

var fab = { method: require( "./fab.method" ).app };

exports.app = fab.method( "DELETE" )