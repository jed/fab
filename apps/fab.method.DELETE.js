var fab = { method: require( "./fab.method" ).app };

exports.summary = "Shortcut for fab.method( 'DELETE' ).";

exports.app = fab.method( "DELETE" )