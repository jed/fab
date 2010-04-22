var fab = { path: require( "./fab.path" ).app };

exports.app = function( pattern ) {
  return fab.path.apply( this, arguments );
}