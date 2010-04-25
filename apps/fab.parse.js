var fab = { map: require( "./fab.map" ).app };

exports.summary = "A binary app that converts JSON responses into objects.";

exports.app = fab.map( function( obj ) {
  var body = obj.body;
  if ( typeof body == "string" ) obj.body = JSON.parse( body );
  return obj;
})