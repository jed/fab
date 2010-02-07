// the generator function, doubling as namespace
function fab() {
  function self(){ return fab.dispatch.apply( self, arguments ) };

  for ( var name in fab.prototype ) {
    self[ name ] = fab.prototype[ name ];
  }
  
  self.prototype = fab.prototype;

  self.last = self;
  
  self.paths = [];
  self.method = {};
  self.status = fab.status;

  self.handler = function(){ return fab.handle.apply( this, arguments ) };

  return fab.dispatch.apply( self, arguments );
};

fab.VERSION = "0.2.0";
fab.escapeRegExp = function( str ) {
  return str.replace( /[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&" );
};

// adapted from http://github.com/documentcloud/underscore/
var
  isNumber = fab.isNumber = function( obj ) {
    return +obj === obj || toString.call( obj ) === "[object Number]";
  },
  
  isArray = fab.isArray = function( obj ) {
    return !!( obj && obj.concat && obj.unshift );
  },
  
  isUndefined = fab.isUndefined = function( obj ) {
    return typeof obj == "undefined";
  },
  
  isFunction = fab.isFunction = function( obj ) {
    return !!( obj && obj.constructor && obj.call && obj.apply );
  },
  
  isRegExp = fab.isRegExp = function( obj ) {
    return !!( obj && obj.test && obj.exec &&
        ( obj.ignoreCase || obj.ignoreCase === false ) );
  },
  
  isString = fab.isString = function( obj ) {
    return !!( obj === "" || (obj && obj.charCodeAt && obj.substr ) );
  };

// for commonJS module usage
if ( !isUndefined( module ) && !isUndefined( module.exports ) ) {
  module.exports = fab;
}

// determine action based on arguments
fab.dispatch = function( arg ) {
  // end current context
  if ( isUndefined( arg ) ) {
    return this.last;
  }
  
  // end (fab) chain, return listener
  if ( arg === fab ) {
    return fab.end.apply( this, arguments );
  }
  
  // extend current context with another
  if ( arg.prototype === fab.prototype ) {
    return fab.extend.call( this, arg );
  }
  
  // append path to current context    
  if ( isString( arg ) || isRegExp( arg ) ) {
    return fab.append.apply( this, arguments );
  }
  
  // apply middleware
  if ( isFunction( arg ) ) {
    this.handler = fab.handler( arg( this.handler ) );
    return this;
  }
      
  throw "Unsupported signature.";
};

// extend one fab with another
fab.extend = function( context ) {
  var code, method;

  for ( code in context.status ) {
    if ( context.status.hasOwnProperty( code ) ) {
      this.status[ code ] = context.status[ code ]
    }
  }

  for ( method in context.method ) {
    if ( context.method.hasOwnProperty( method ) ) {
      this.method[ code ] = context.method[ code ]
    }
  }
  
  for ( var i = 0, ii = context.paths.length; i < ii; i++ ) {
    var
      pattern = context.paths[ i ][ 0 ].source,
      child = context.paths[ i ][ 1 ],
      matched = 0,
      j = 0;
      
    for ( var jj = this.paths.length; j < jj; j++ ) {
      var source = this.paths[ j ][ 0 ].source;
      if ( source == pattern ) matched = 1;
      if ( source >= pattern ) break;
    }
    
    this.paths.splice( j, matched, [ context.paths[ i ][ 0 ], child ] );
  }
  
  return this;
}

// add a new child to the current node
fab.append = function( pattern, fn ) {
  var
    flags = "",
    paths = this.paths,
    i = 0,
    matched = 0,
    child = fab();

  if ( isString( pattern ) ) {
    pattern = fab.escapeRegExp( pattern );
  }

  else if ( isRegExp( pattern ) ) {
    pattern = pattern.source;
    flags = pattern.toString().split( "/" ).pop();
  }
  
  pattern = pattern.replace( /^[^^]/, "^$&" );

  child.last = this;
  child.status = fab.create( this.status );
  
  for ( var len = paths.length, source; i < len; i++ ) {
    source = paths[ i ][ 0 ].source;
    if ( source == pattern ) matched = 1;
    if ( source >= pattern ) break;
  }
  
  paths.splice( i, matched, [ new RegExp( pattern, flags ), child ] );
  
  return isUndefined( fn ) ? child : fab.GET.call( child, fn ).last;
}

// default fab handler to perform routing
fab.handle = function( respond ) {
  var
    context = this.context,
    paths = context.paths,
    i = paths.length,
    match, next,
    url = this.url,
    path = url.pathname.substr( this.cursor );

  if ( !path ) {
    return (
      context.method[ this.method ] ||
      context.method[ "*" ] ||
      context.status[ 405 ]
    ).apply( this, arguments );
  }

  while ( i-- ) {
    next = paths[ i ];
    match = path.match( next[ 0 ] );
    if ( !match ) continue;

    this.context = next[ 1 ];
    this.cursor += match.shift().length;
    url.pattern += next[ 0 ].source.substr( 1 );
    if ( match.length ) {
      Array.prototype.push.apply( url.capture.original, match );
    }

    return fab.handle.apply( this, arguments );
  }
  
  context.status[ 404 ].apply( this, arguments );
}

var responseKeys = { status: 1, headers: 1, body: 1 }
// turn a value into a fab handler
fab.handler = function( obj ) {
  var fn = obj;

  return function( respond ) {
    
    if ( isFunction( fn ) ) {
      obj = fn.length === 1
        ? fn.call( this, process )
        : fn.call( this, this, process );
    }

    if ( !isUndefined( obj ) ) {
      process.call( this, obj );

      if ( !isFunction( obj ) ) {
        respond( null );
      }
    }

    function process() {
      for ( var i = 0, l = arguments.length, obj; i < l; i++ ) {
        var key, obj = arguments[ i++ ];
        
        if ( obj !== null ) {

          if ( obj === +obj ) {
            return this.context.status[ obj ].call( this, respond );
          }
          
          for ( key in obj ) {
            if ( !( key in responseKeys ) ) break;
          }
          
          if ( !( key in responseKeys ) ) {
            obj = { body: obj };
          }
        }
        
        respond( obj );
      };
    }

  }
};

// prototypal inheritance
fab.create = ( function( F ) {
  return function( o ) {
    F.prototype = o;
    return new F;
  };
})( function(){} );

// adapted from jQuery
fab.each = function( obj, cb ) {
  var l = obj.length;

  if ( isUndefined( l ) || isFunction( obj ) ) {
    for ( var name in obj ) {
      if ( cb.call( obj[ name ], name, obj[ name ] ) === false ) break;
    }
  }
  
  else {
    for ( var i = 0, val = obj[ 0 ];
      i < l && cb.call( val, i, val ) !== false; val = obj[ ++i ] ) {}
  }

  return obj;
};

fab.end = function() {
  return this;
}

// add method convenience methods to fab
fab.each(
  "HEAD GET POST PUT DELETE TRACE OPTIONS CONNECT *".split(" "),
  function( i, name ) {
    fab[ name ] = fab.prototype[ name ] = function( fn ) {
      var self = this;
      if ( self == fab ) self = fab();
      self.method[ name ] = fab.handler( fn );
      return self;
    };  
  }
);

// add status convenience methods to fab
fab.status = {};
fab.each( [ 1, 6, 5, 15, 5 ], function( c, i ) {
  fab.each( Array( i + 1 ), function( i ) {
    var code = 100 * ( c + 1 ) + i;

    fab.prototype[ code ] = function( fn ) {
      this.status[ code ] = fab.handler( fn );
      return this;
    };

    fab.status[ code ] = fab.handler({
      status: code,
      headers: { "content-type": "text/plain" },
      body: "Status: " + code
    });
  })
});

// create fab constructors
fab.each(
  "url".split(" "),
  function( i, name ) {
    fab[ name ] = function() {
      return fab[ name ].prototype.init.apply( this, arguments );
    };
  }
);

fab.end = function() {
  return this.handler;
}

fab.log = function() { throw "Not implemented." }