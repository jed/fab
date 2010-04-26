exports.name      = "fab.method.GET";
exports.summary   = "Shortcut for fab.method( 'GET' ).";
exports.requires  = [ "fab.method" ];

var fab = { method: require( "./fab.method" ).app };

exports.app = fab.method( "GET" );