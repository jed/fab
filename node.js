var
  fab = exports.fab = require( "./fab" ).fab,
  http = require( "http" ),
  url = require( "url" ),
  sys = require( "sys" );
  
fab.log = function() {
  sys.puts( Array.prototype.join.call( arguments, ", " ) );
};

fab.end = function() {
  return fab.adapter( this );
}

fab.adapter = function( handler ) {
  return function( request, response ) {
    var body = handler(
      new fab.request( request ),
      new fab.response( response )
    );
    
    if ( typeof body === "function" ) {
      request
        .addListener( "body", body )
        .addListener( "complete", function(){ body( null ) } );
    }
  }
};

fab.request.prototype.init = function( request ) {  
  this.arguments = arguments;
  this.method = request.method;  
  this.headers = request.headers;
  this.url = new fab.url( "http://" + this.headers.host + request.url );
};

fab.response.prototype.init = function( response ) {
  var
    status = 200,
    headers = {},

    respond = function( data ) {
      if ( data === null )
        response.finish();
        
      else switch ( typeof data ) {
        case "number":
          status = data;
          break;

        case "object":
          fab.extend( headers, data );
          break;
          
        default:
          if ( headers ) {
            response.sendHeader( status, headers );
            headers = false;
          };
          
          response.sendBody( data.toString(), respond.encoding );
          break;
      }
      
      return respond;
    };
  
  respond.arguments = arguments;
  respond.encoding = "ascii";
  return respond;
};

fab.url.prototype.init = function( str ) {
  process.mixin( this, url.parse( str, true ) )
  
  var original = { length: 0 };
  this.capture = fab.create( original );
  this.capture.original = original;

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