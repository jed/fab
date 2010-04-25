var fab = { method: require( "./fab.method" ).app };

exports.summary = "Shortcut for fab.method( 'POST' ).";

exports.app = fab.method( "POST" )