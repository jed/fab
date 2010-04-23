exports.summary = "A unary app that takes a location and fetches it over http.";

exports.app = function( loc ) {
  loc = require( "url" ).parse( loc )

  var client = require( "http" )
    .createClient( loc.port || 80, loc.hostname );

  return function() {
    var out = this;

    return function( head ) {
      head.headers.host = loc.hostname;
      
      client
        .request(
          head.method,
          loc.pathname + head.url.pathname + ( head.url.search || "" ),
          head.headers
        )
        .addListener( "response", function( response ) {
          out({
            status: response.statusCode,
            headers: response.headers
          });
        
          response
            .addListener( "data", function( chunk ) {
              out({ body: chunk });
            })
            .addListener( "end", out )
            .setBodyEncoding( "utf8" );
        })
        .close();
    }
  }
}