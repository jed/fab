exports.summary = "A binary app that converts the upstream app into a node.js-compatible listener.";

exports.app = function( app ) {
  var url = require( "url" );

  return function() {
    var
      request = arguments[ 0 ],
      response = arguments[ 1 ],
      headers = undefined,
      status = 200,
      _encoding = "ascii",
      inbound = app.call( listener );
    
    if ( inbound ) {
      inbound = inbound({
        method: request.method,
        headers: request.headers,
        url: url.parse( request.url )
      });
    }
    
    if ( inbound ) {
      request
        .addListener( "end", inbound )
        .addListener( "data", function( body ) {
          if ( inbound ) inbound = inbound({ body: body });
        })
    }

    function listener( obj ) {
      if ( obj ) {
      
        if ( "status" in obj ) {
          status = obj.status;
        }

        if ( "headers" in obj ) {
          if ( headers ) process.mixin( headers, obj.headers );
          else headers = obj.headers;
        }

        if ( "_encoding" in obj ) {
          _encoding = obj._encoding;
        }
  
        if ( "body" in obj ) {
          if ( headers !== false ) {
            response.writeHead( status, headers || {} );
            headers = false;
          }
          
          response.write( obj.body, _encoding );
        }

        return listener;
      }
      
      else {
        if ( headers !== false ) {
          response.writeHead( status, headers || {} );
          headers = false;
        }
        
        response.end();
      }
    }
  }
}