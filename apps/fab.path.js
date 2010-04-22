exports.summary = "Takes a string or regular expression pattern, and returns a ternary app that passes the request to the first app if the path mathes the pattern, or the second app otherwise. When the path is matches, the matching part of the existing path is truncated before the request is passed.";

exports.app = function( pattern ) {
  var
    proto = Array.prototype,
    match = {
      String: function( url ) {
        if ( path.indexOf( pattern ) ) return false;

        url.pathname = url.pathname.substr( pattern.length );
        return true;
      },
      
      RegExp: function( url ) {
        var match = false;

        url.pathname = url.pathname.replace( pattern, function() {
          match = true;

          var capture = proto.slice.call( arguments, 1, -2 );
          
          if ( !url.capture ) url.capture = capture;
          else proto.push.apply( url.capture, capture );

          return "";
        });
        
        return match;
      }
    }[ pattern.constructor.name ];
  
  return function( hit ) {
    return function( miss ) {
      return function() {
        var out = this;
        return function( head ) {
          var app = match( head.url ) ? hit : miss;

          app = app.call( out );
          if ( app ) app = app( head );
          
          return app;
        }
      }
    }
  }
}