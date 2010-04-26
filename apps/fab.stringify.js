var fab = { map: require( "./fab.map" ).app };

exports.name      = "fab.stringify";
exports.summary   = "Converts non-string responses into JSON.";
exports.requires  = [ "fab.map" ];

exports.app = fab.map( function( obj ) {
  var body = obj.body;
  if ( typeof body != "string" ) obj.body = JSON.stringify( body );
  return obj;
})