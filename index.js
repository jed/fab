sys = require( "sys" )

module.exports = fab;

function fab() {
  var stack = [];
  
  return collect.apply( this, arguments );

  function collect( fn ) {
    var
      args = stack.slice.call( arguments ),
      length = args.length;
    
    if ( !length ) fn = fab.self;

    if ( length > 1 ) fn = fab( fn ).apply( this, args.slice( 1 ) );
    
    fn = ( fn && fab[ fn.constructor.name ] || fab.body )( fn );
    
    stack.unshift( fn );
    
    return reduce();
  }
  
  function reduce() {
    if ( stack[ 0 ].length ) return collect;

    if ( stack.length == 1 ) return stack.shift();
    
    if ( stack[ 1 ] == fab.self ) {
      var app = stack[ 0 ];
      stack.splice( 1, 1 );
      reduce();
      stack.unshift( app );
    }
    
    stack.splice( 0, 2, stack[ 1 ]( stack[ 0 ] ) );
    return reduce();
  }
}

fab.body = function( obj ) {
  return function() {
    var out = this({ body: obj });
    if ( out ) out();
  }
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
      
    return function( hit ) {
      return function( miss ) {
        return function() {
          var out = this;
          return function( head ) {
            var app = head.method in methods ? hit : miss;
            
            app = app.call( out );
            if ( app ) app = app( head );
            
            return app;
          }
        }
      }
    }
  }
})( "HEAD GET POST PUT DELETE TRACE OPTIONS CONNECT".split( " " ) )

fab.path = function( pattern ) {
  var match = {
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
  
  return function( hit ) {
    return function( miss ) {
      return function() {
        var out = this;
        return function( head ) {
          var
            app = miss,
            url = match( head.url );
          
          if ( url ) {
            head.url = url;
            app = hit;
          }
          
          app = app.call( out );
          if ( app ) app = app( head );
          
          return app;
        }
      }
    }
  }
}

fab.status = function( code ) {
  code = +code;
  return function() {
    var out = this({ status: code });
    if ( out ) out();
  }
}

fab.serialize = function( app ) {
  return function() {
    var out = this;

    return app.call( function listener( obj ) {
      if ( obj && obj.body && typeof obj.body != "string" ) {
        obj.body = JSON.stringify( obj.body );
      }
      
      out = out.apply( this, arguments );
      
      return listener;
    })
  }
}

fab.contentLength = function( app ) {
  return function() {
    var out = this;
    
    return app.call( function listener( obj ) {
      if ( obj && typeof obj.body == "string" ) {
        ( obj.headers = obj.headers || {} )
          [ "content-length" ] = process._byteLength( obj.body );
      }
      
      out = out.apply( this, arguments );
      
      return listener;
    })
  }
}

fab.fs = function( root ) {
  root = root || process.cwd();

  var
    fs = require( "fs" ),
    path = require( "path" );

  return function() {
    var out = this;

    return function( head ) {
      if ( head.method != "GET" ) out({ status: 405 })();
      
      var pathname = path.join( root, head.url.pathname ); 
      
      fs.readFile( pathname, "utf8", function( err, data ) {
        out( err ? { status: 404 } : { body: data } )();
      })
    }
  }
}

fab.http = function( loc ) {
  loc = require( "url" ).parse( loc )

  var client = require( "http" )
    .createClient( loc.port || 80, loc.hostname );

  return function() {
    var out = this;

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
              out({ body: chunk });
            })
            .addListener( "end", out )
            .setBodyEncoding( "utf8" );
        })
        .close();
    }
  }
}

fab.nodejs = function( app ) {
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

fab.tmpl = function( source ) {
  source.call( function( obj ) {
    source = new Function( "p",
      "p.push('" +
      obj.body
        .replace( /[\r\t\n]/g, " " )
        .replace( /'(?=[^%]*%>)/g, "\t" )
        .split( "'" ).join( "\\'" )
        .split( "\t" ).join( "'" )
        .replace( /<%=(.+?)%>/g, "',$1,'" )
        .split( "<%" ).join( "');" )
        .split( "%>" ).join( "p.push('" )
        + "');return p.join('');" );
  });
  
  return function( app ) {
    return function() {
      var out = this;

      return app.call( function listener( obj ) {
        if ( obj && obj.body ) {
          obj.body = source.call( obj.body, [] );
        }

        out = out.apply( this, arguments );
        
        return listener;
      });
    }
  }
};

fab.self = function( obj ){ return obj };

fab.Function = fab.self;
fab.RegExp = fab.path;
fab.Number = fab.status;