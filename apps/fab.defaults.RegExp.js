exports.name      = "fab.defaults.RegExp";
exports.summary   = "Uses fab.path for regular expressions.";
exports.requires  = [ "fab.path" ];

var fab = { path: require( "./fab.path" ).app };

exports.app = function( pattern ) {
  return fab.path.apply( this, arguments );
}