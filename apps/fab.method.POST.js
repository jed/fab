exports.name      = "fab.method.POST";
exports.summary   = "Shortcut for fab.method( 'POST' ).";
exports.requires  = [ "fab.method" ];

var fab = { method: require( "./fab.method" ).app };

exports.app = fab.method( "POST" )