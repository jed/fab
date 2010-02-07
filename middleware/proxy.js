// fetches a remote url and responds with its contents.
// urls can be passed as instances of fab.url in response body,
// or by using the Location header.
// 
// ( fab )
//   ( require( "fab/middleware/proxy" ) )
//   ( "/byHeader", { headers: { Location: "http://fabjs.org" } } )
//   ( "/byBody", new fab.url( "http://fabjs.org" ) )
// ( fab )

var
  http = require( "http" ),
  fab = require( "fab" ),
  url = require( "url" );

module.exports = function( handler ) {
  return function( request, respond ) {
    var loc;

    handler.call( this, function( data ) {
      if ( data === null ) {
        if ( !loc )
          return respond( 500, null );
      
        request.headers.host = loc.hostname;

        http
          .createClient( loc.port || 80, loc.hostname )
          .request( request.method, loc.pathname, request.headers )
          .finish( function( response ) {
            respond({
              status: response.statusCode,
              headers: response.headers
            });

            response
              .addListener( "body", respond )
              .addListener( "complete", function(){ respond( null ) } )
          });
      }

      else if ( data.headers )
        loc = url.parse( data.headers.Location );
      
      else if ( data.body instanceof fab.url )
        loc = data.body;
        
    })
  }
}