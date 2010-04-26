exports.name      = "fab.parse";
exports.summary   = "Converts JSON responses into objects.";
exports.requires  = [];

var fab = { map: require( "./fab.map" ).app };


exports.app = fab.map( function( obj ) {
  var body = obj.body;
  if ( typeof body == "string" ) obj.body = JSON.parse( body );
  return obj;
})