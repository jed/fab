module.exports = function( exports, imports ) {
  var url = require( "url" );

  return imports( function( queue, render ) {
    return exports( function( write, fn ) {
      return queue( function( upstream ) {
        if ( fn ) fn( listener );
        return write( listener );

        function listener( req, res ) {
          var status = 200
            , headers = {};
            
          upstream( render(
            read,
    
            {
              method: req.method,
              headers: req.headers,
              url: url.parse( "//" + req.headers.host + req.url, false, true )
            },
    
            function body( write ) {
              req.on( "data", write ).on( "end", write );
            }
          ));
            
          function read( body, head ) {
            if ( !arguments.length ) res.end();
      
            else {
              if ( head ) {
                if ( "status" in head ) status = head.status;
                
                if ( "headers" in head ) {
                  for ( var name in head.headers ) {
                    headers[ name ] = head.headers[ name ]
                  }
                }
              }
      
              if ( body ) {
                if ( headers ) {
                  res.writeHead( status, headers );
                  headers = undefined;
                }
                
                res.write( body );
              }
            }
      
            return read;
          }
        }
      })
    })
  }, "queue", "render" )
}