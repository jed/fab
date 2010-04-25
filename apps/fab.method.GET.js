var fab = { method: require( "./fab.method" ).app };

exports.summary = "Shortcut for fab.method( 'GET' ).";

exports.app = fab.method( "GET" )