function() {

  var
    app = arguments[ 0 ],
    url = require( "url" );

  return function( request ) {
    var
      response = arguments[ 1 ],
      headers = undefined,
      status = 200,
      _encoding = "ascii",
      down = app( listener );
    
    if ( down ) {
      down = down({
        method: request.method,
        headers: request.headers,
        url: url.parse( request.url )
      });
    }
    
    if ( down ) {
      request
        .addListener( "data", function( body ) {
          if ( down ) down = down( { body: body } );
        })
        .addListener( "end", down );
    }

    function listener( obj ) {
      if ( arguments.length ) {

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
        
        response.close();
      }
    }
  }
}