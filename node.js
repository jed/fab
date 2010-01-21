var
  fab = exports.fab = require( "./fab" ).fab,
  url = require( "url" ),
  sys = require( "sys" );
  
fab.log = function() {
  sys.puts( Array.prototype.join.call( arguments, ", " ) );
};

fab.end = function() {
  return fab.adapter.call( this, this.handler );
}

fab.adapter = function( handler ) {
  var self = this;
  return function( request, response ) {
    var
      status = 200,
      headers = {};

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
          response.finish();
        }
          
        else if ( fab.isNumber( data ) ) {
          status = data;
        }
  
        else if ( typeof data === "object" ) {
          fab.extend( headers, data );
        }
        
        else if ( fab.isFunction( data ) ) {
          request
            .addListener( "body", data )
            .addListener( "complete", function(){ data( null ) } );
        }
        
        else {
          if ( headers ) {
            response.sendHeader( status, headers );
            headers = false;
          };
          
          response.sendBody( data.toString(), "ascii" );
        }
        
        return arguments.callee;
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