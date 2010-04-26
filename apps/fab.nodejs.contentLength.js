exports.name      = "fab.nodejs.contentLength";
exports.summary   = "Adds a Content-Length header based on the length of the response body.";
exports.requires  = [ "fab.nodejs" ];

var fab = { map: require( "./fab.map" ).app };

exports.app = fab.map( function( obj ) {
  if ( typeof obj.body == "string" ) {
    ( obj.headers = obj.headers || {} )
      [ "content-length" ] = process._byteLength( obj.body );
  }
  
  return obj;
})