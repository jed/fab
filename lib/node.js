var
  fab = module.exports = require( "./core" ),
  url = require( "url" ),
  args = process.argv;
  
fab.log = require( "sys" ).puts;

fab.end = function() {
  return fab.adapter.call( this, this.handler );
}

fab.adapter = function( handler ) {
  var self = this;
  return function( request, response ) {
    var
      status = 200,
      headers = {},
      _encoding = "utf8";

    handler.call(
      {
        context: self,
        cursor: 0,
        method: request.method,
        headers: request.headers,
        url: new fab.url( "http://" + request.headers.host + request.url )
      },
      function( data ) {
        if ( data === null ) {
          if ( headers ) {
            response.sendHeader( status, headers );
          }

          response.close();
        }
          
        else if ( fab.isFunction( data ) ) {
          request
            .addListener( "data", data )
            .addListener( "end", function(){ data( null ) } );
        }
        
        else {
          // TODO: get rid of this when buffers are implemented
          if ( "_encoding" in data ) {
            _encoding = data._encoding;
          }
    
          if ( "status" in data ) {
            status = data.status;
          }

          if ( "headers" in data ) {
            // TODO: support for multiple headers
            for ( var name in data.headers ) {
              headers[ name ] = data.headers[ name ];
            }
          }
          
          if ( "body" in data ) {            
            if ( headers ) {
              response.sendHeader( status, headers );
              headers = false;
            };
            
            response.write( data.body, _encoding );
          }
        }
      }
    );
  }
};

fab.url.prototype.init = function( str ) {
  process.mixin( this, url.parse( str, true ) )
  
  var original = { length: 0 };
  this.capture = fab.create( original );
  this.capture.original = original;
  
  this.pattern = "";

  return this;
}

fab.url.prototype.toString = function() {
  var
    capture = this.capture,
    ret = Array.prototype.slice.call( capture.original );
    
  fab.each( ret, function( i ) { ret[ i ] = fab.escapeRegExp( this ) })
  ret = new RegExp( "^(.*)(" + ret.join( ")(.*)(" ) + ")(.*)$" )
    .exec( this.pathname )
    .slice( 1 );
  
  fab.each( capture, function( i, val ) {
    ret[ 2 * i + 1 ] = capture[ i ];
  });

  this.pathname = ret.join( "" );

  return url.format( this );
};

// if this file is run (not required), launch server
if ( args[ 1 ] == __filename ) {
  var port = 0xFAB, file = args[ 2 ];
  
  if ( args[ 3 ] == "-p" )
    port = +args[ 4 ];
  
  require( "posix" )
    .cat( file )
    .addCallback( function( app ) {
      require( "http" )
        .createServer( eval( app ) )
        .listen( port )
    });

}