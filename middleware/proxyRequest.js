// fetches a local file or remote resource and responds with its contents.
// urls can be passed as instances of fab.url in response body,
// or by using the Location header.
//
// the "file:" protocol is used by default.
// 
// ( fab )
//   ( require( "fab/middleware/proxyRequest" ) )
//
//   ( "/httpByHeader", { headers: { location: "http://fabjs.org" } } )
//   ( "/httpByBody", new fab.url( "http://fabjs.org" ) )
//
//   ( "/fileByHeader", { headers: { location: "foo/bar.js" } } )
//   ( "/fileByBody", new fab.url( "file://foo/bar.js" ) )
// ( fab )

var
  fab = require( "fab" ),
  http = require( "http" ),
  path = require( "path" ),
  posix = require( "posix" ),
  handlers = {

    "file:": function( url ) {
      return function( respond ) {
        posix
          .cat( path.join( process.cwd(), url.pathname ) )
          .addCallback( function( data ) {
            respond( data, null )
          })
          .addErrback( function() {
            respond( 500, null )
          })
      }
    },
    
    "http:": function( url ) {
      return function( respond ) {
        http
          .createClient(
            url.port || 80,
            request.headers.host = url.hostname
          )
          .request(
            request.method,
            url.pathname + ( url.search || "" ),
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
    }

  };

module.exports = function( handler ) {
  return function( request, respond ) {
    var url;
    
    return handler.call( this, function( data ) {
      if ( data === null ) {
        if ( url ) {
          url.protocol = url.protocol || "file:"
          handlers[ url.protocol ]( url ).call( this, respond );
        }

        else respond( 500, null );
      }

      else if ( data.headers )
        url = new fab.url( data.headers.location );
      
      else if ( data.body instanceof fab.url )
        url = data.body;
    })
  }
}