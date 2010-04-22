var fab = { map: require( "./fab.map" ).app };

exports.summary = "A binary app that adds a Content-Length header based on the length of the response body.";

exports.app = fab.map( function( obj ) {
  if ( typeof obj.body == "string" ) {
    ( obj.headers = obj.headers || {} )
      [ "content-length" ] = process._byteLength( obj.body );
  }
  
  return obj;
})