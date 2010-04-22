var fab = { status: require( "./fab.status" ).app };

exports.app = function( code ) {
  return fab.status.apply( this, arguments );
}