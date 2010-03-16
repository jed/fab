function fab() {
  var args = [];
  
  return arguments.length
    ? collect.apply( this, arguments )
    : collect;

  function collect() {
    var
      a = arguments,
      l = a.length,
      i = 0;

    if ( !l ) return evaluate();
    
    while ( i < l ) {
      a[ i ] = fab[ a[ i ].constructor.name ]( a[ i ] );
      if ( a[ i++ ].length ) break;
    }
    
    while ( i --> 1 ) {
      while ( !a[ i ].length ) a[ i ] = a[ i ]();

      a[ i - 1 ] = a[ i - 1 ]( a[ i ] );
    }
    
    args.unshift( a[ 0 ] );
    
    return collect;
  }

  function evaluate() {
    while ( !args[ 0 ].length ) args[ 0 ] = args[ 0 ]();

    while ( args.length > 1 && args[ 0 ].length ) {
      args.splice( 0, 2, args[ 1 ]( args[ 0 ] ) )
    }

    if ( args.length == 1 && args[ 0 ].length == 1 ) return args[ 0 ];
    
    return collect;
  }
}

module.exports = fab;

fab.version = "0.3.0";

fab.basicAuth = ( function( decode ) {

  return function() {
    var
      realm = arguments[ 0 ] || "Secure Area",
      _401 = {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic realm=\"" + realm + "\""
        }
      },
  
      fn = arguments[ 1 ] || function(){ return true };
    
    return function() {
      var success = arguments[ 0 ];
  
      return function( respond ) {
        return function( head ) {
          var
            auth = head.headers.authorization,
            authenticated, next;
            
          if ( !auth || auth.substr( 0, 6 ) !== "Basic " ) {
            return respond( _401 )();
          }
          
          authenticated = fn.apply(
            this, decode( auth.substr( 6 ) ).split( ":" )
          );
          
          if ( !authenticated ) {
            return respond({ status: 403 })();
          }
          
          next = success( respond );
          if ( next ) next = next( head );
          
          return next;
        }
      }
    }
  }
})(

  ( function() {

    var
      base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      base64DecodeChars = [];
    
    for ( var i = 128; i--; ) {
      if ( base64DecodeChars[ i ] === undefined )
        base64DecodeChars[ i ] = -1;
    
      base64DecodeChars[ base64EncodeChars.charCodeAt( i ) ] = i;
    }
    
    return base64decode;

    /* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
     * Version: 1.0
     * LastModified: Dec 25 1999
     * This library is free.  You can redistribute it and/or modify it.
     */
    
    function base64decode( str ) {
        var c1, c2, c3, c4;
        var i, len, out;
    
        len = str.length;
        i = 0;
        out = "";
        while(i < len) {
      /* c1 */
      do {
          c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while(i < len && c1 == -1);
      if(c1 == -1)
          break;
    
      /* c2 */
      do {
          c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while(i < len && c2 == -1);
      if(c2 == -1)
          break;
    
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    
      /* c3 */
      do {
          c3 = str.charCodeAt(i++) & 0xff;
          if(c3 == 61)
        return out;
          c3 = base64DecodeChars[c3];
      } while(i < len && c3 == -1);
      if(c3 == -1)
          break;
    
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
    
      /* c4 */
      do {
          c4 = str.charCodeAt(i++) & 0xff;
          if(c4 == 61)
        return out;
          c4 = base64DecodeChars[c4];
      } while(i < len && c4 == -1);
      if(c4 == -1)
          break;
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }  
  })()
)

fab.body = function( str ) {
  return function( back ) {
    back = back({ body: str });
    if ( back ) back = back();
  }
}

fab.Function = function( fn ) {
  var i = fn.length, args = [];

  return i < 2 ? fn :
    function collect() {
      args[ --i ] = arguments[ 0 ];

      return i > 1 ? collect :
        function( arg ) {
          args[ 0 ] = arg;
          return fn.apply( this, args );
        };
    };
}

fab.method = ( function( names, name ) {
  while ( name = names.pop() ) method[ name ] = method( name );
    
  return method;

  function method() {
    var
      methods = {},
      len = arguments.length;
    
    for ( var i = 0; i < len; i++ ) {
      methods[ arguments[ i ] ] = true;
    }
      
    return function() {
      var hit = arguments[ 0 ];
  
      return function() {
        var miss = arguments[ 0 ] || fab.status( 405 )();
  
        return function( respond ) {
          return function( head ) {
            var app = head.method in methods ? hit : miss;
            
            app = app( respond );
            if ( app ) app = app( head );
            
            return app;
          }
        }
      }
    }
  }
})( "HEAD GET POST PUT DELETE TRACE OPTIONS CONNECT".split( " " ) )

fab.Number = function( num ) {
  return fab.status( num );
}

fab.path = function() {
  var
    pattern = arguments[ 0 ],
    match = {
      String: function( url ) {
        var path = url.pathname;

        if ( path.indexOf( pattern ) ) return;

        url.pathname = path.substr( pattern.length );
        return url;
      },
      
      RegExp: function( url ) {
        var path = url.pathname, matched;

        if ( path.search( pattern ) ) return;
        
        matched = path.match( pattern );
        
        url.pathname = path.substr( matched.shift().length );
        url.capture = url.capture || [];
        url.capture.push.apply( url.capture, matched );
        return url;
      }
    }[ pattern.constructor.name ];
    
  return function() {
    var hit = arguments[ 0 ];

    return function() {
      var miss = arguments[ 0 ] || fab.status( 404 )();

      return function( respond ) {
        return function( head ) {
          var
            app = miss,
            url = match( head.url );
          
          if ( url ) {
            head.url = url;
            app = hit;
          }
          
          app = app( respond );
          if ( app ) app = app( head );
          
          return app;
        }
      }
    }
  }
}

fab.RegExp = function( re ) {
  return fab.path( re );
}

fab.status = function( code ) {
  return function( fwd ) {
    if ( fwd ) { /* TODO: status handler */ }

    return function( back ) {
      back( { status: code } )();
    }
  }
}

fab.String = function() {
  var str = arguments[ 0 ];
  return function() {
    var app = arguments[ 0 ];

    return app
      ? fab.path( str )( app )
      : fab.body( str );
  }
}

fab.listener = function() {

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

fab.remote = function() {
  var
    url = require( "url" ),
    http = require( "http" ),
    loc = url.parse( arguments[ 0 ] ),
    client = http.createClient( loc.port || 80, loc.hostname );

  return function( back ) {
    return function( head ) {
      head.headers.host = loc.hostname;
      
      client
        .request(
          head.method,
          loc.pathname + head.url.pathname + ( head.url.search || "" ),
          head.headers
        )
        .addListener( "response", function( response ) {
          back({
            status: response.statusCode,
            headers: response.headers
          });
        
          response
            .addListener( "data", function( chunk ) {
              back({ body: chunk });
            })
            .addListener( "end", back )
            .setBodyEncoding( "utf8" );
        })
        .close();
    }
  }
}