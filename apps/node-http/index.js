fab.http = function() {
  var
    url = require( "url" ),
    http = require( "http" ),
    loc = url.parse( arguments[ 0 ] ),
    client = http.createClient( loc.port || 80, loc.hostname );

  return function( back ) {
    return function( head ) {
      head.headers.host = loc.hostname;
      
      client
        .request(
          head.method,
          loc.pathname + head.url.pathname + ( head.url.search || "" ),
          head.headers
        )
        .addListener( "response", function( response ) {
          back({
            status: response.statusCode,
            headers: response.headers
          });
        
          response
            .addListener( "data", function( chunk ) {
              back({ body: chunk });
            })
            .addListener( "end", back )
            .setBodyEncoding( "utf8" );
        })
        .close();
    }
  }
}