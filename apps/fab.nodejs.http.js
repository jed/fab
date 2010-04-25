exports.summary = "A binary app that proxies a request to a remote http server. The request information is provided entirely by the upstream app, either in the form of an object with method, headers, and url properties, or as a body property containing the url to proxy.";

exports.app = function( app ) {
  var url = require( "url" )
    , http = require( "http" );

  return function() {
    var out = this;

    app.call( function( obj ) {
      var loc = obj.url || url.parse( obj.body );

      http
        .createClient( loc.port || 80, loc.hostname )
        .request(
          obj.method || "GET",
          loc.pathname + ( loc.search || "" ),
          obj.headers || { host: loc.hostname }
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
        .end();    
    });
  }
}