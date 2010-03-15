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

fab.version = "0.3.0";

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

fab.method = ( function( names ) {
  var name;
    
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