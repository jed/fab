// fetches a remote url and responds with its contents.
// urls can be passed as instances of fab.url in response body,
// or by using the Location header.
// 
// ( fab )
//   ( require( "fab/middleware/proxy" ) )
//   ( "/byHeader", { headers: { location: "http://fabjs.org" } } )
//   ( "/byBody", new fab.url( "http://fabjs.org" ) )
// ( fab )

var
  http = require( "http" ),
  fab = require( "fab" ),
  url = require( "url" );

module.exports = function( handler ) {
  return function( request, respond ) {
    var loc;
    
    return handler.call( this, function( data ) {
      if ( data === null ) {
        if ( !loc )
          return respond( 500, null );
      
        http
          .createClient(
            loc.port || 80,
            request.headers.host = loc.hostname
          )
          .request(
            request.method,
            loc.pathname + ( loc.search || "" ),
            request.headers
          )
          .finish( function( response ) {
            response.setBodyEncoding( "utf8" );

            response
              .addListener( "body", respond )
              .addListener( "complete", function(){ respond( null ) } );

            respond({
              status: response.statusCode,
              headers: response.headers
            });
          });
      }

      else if ( data.headers )
        loc = url.parse( data.headers.location );
      
      else if ( data.body instanceof fab.url )
        loc = data.body;
        
    })
  }
}