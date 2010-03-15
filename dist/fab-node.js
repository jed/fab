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

fab.Number = function( num ) {
  return fab.status( num );
}

fab.path = function() {
  var
    pattern = arguments[ 0 ],
    length = pattern.length;

  return function() {
    var hit = arguments[ 0 ];

    return function() {
      var miss = arguments[ 0 ] || fab.status( 404 )();

      return function( respond ) {
        return function( head ) {
          var app = miss;
          
          if ( !head.url.indexOf( pattern ) ) {
            head.url = head.url.substr( length );
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
  var app = arguments[ 0 ];

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
        url: request.url        
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