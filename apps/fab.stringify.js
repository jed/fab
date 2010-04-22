var fab = { map: require( "./fab.map" ).app };

exports.summary = "A binary app that converts non-string responses into JSON.";

exports.app = fab.map( function( obj ) {
  var body = obj.body;
  if ( typeof body != "string" ) obj.body = JSON.stringify( body );
  return obj;
})