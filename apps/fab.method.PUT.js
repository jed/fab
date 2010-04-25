var fab = { method: require( "./fab.method" ).app };

exports.summary = "Shortcut for fab.method( 'PUT' ).";

exports.app = fab.method( "PUT" )