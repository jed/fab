// the core function, doubling as namespace
function fab() {
  function self(){ return fab.dispatch.apply( self, arguments ) };
  return fab.init.apply( self, arguments );
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
if ( !isUndefined( exports ) ) {
  exports.fab = fab;
}

// processing for a new fab
fab.init = function() {
  for ( var name in fab.prototype )
    this[ name ] = fab.prototype[ name ];

  this.last = this;
  
  this.paths = [];
  this.method = {};

  this.handler = fab.handle;
  this.status = fab.status;
  
  return this.apply( this, arguments );
}

// determine action based on arguments
fab.dispatch = function( first ) {
  if ( first instanceof fab.request ) {
    first.context = this;
    first.cursor = 0;
    first.url.pattern = "";
    return this.handler.call( first, arguments[ 1 ] );
  }
    
  if ( isUndefined( first ) ) {
    return this.last;
  }

  if ( first === fab ) {
    return this( fab.end );
  }
    
  if ( isString( first ) || isRegExp( first ) ) {
    return fab.append.apply( this, arguments );
  }

  if ( isFunction( first ) ) {
    return first.apply( this, Array.prototype.slice.call( arguments, 1 ) );
  }
      
  throw "Unsupported signature.";
};

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
  
  return isUndefined( fn ) ? child : child[ "GET" ]( fn ).last;
}

// default fab handler to perform routing
fab.handle = function( respond ) {
  var
    context = this.context,
    method = context.method,
    status = context.status,
    paths = context.paths,
    i = paths.length,
    match, next,
    url = this.url,
    path = url.pathname.substr( this.cursor );

  if ( !path ) {
    return ( method[ this.method ] || method[ "*" ] || status[ 405 ] )
      .apply( this, arguments );
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

    return next[ 1 ].handler.apply( this, arguments );
  }
  
  status[ 404 ].apply( this, arguments );
}

// turn a value into a fab handler
fab.handler = function( obj ) {
  var fn = obj;

  return function( respond ) {  
    function each() {
      var i = 0, len = arguments.length;
      while ( i < len ) respond( arguments[ i++ ] );
    }
    
    if ( isFunction( fn ) ) {
      obj = fn.call( this, each );
    }
      
    if ( isFunction( obj ) ) {
      return obj;
    }

    if ( obj instanceof fab.url ) {
      each( 302, { "Location": obj.toString() }, "Moved to ", null );
      return;
    }
      
    if ( isNumber( obj ) ) {
      return this.context.status[ obj ].apply( this, arguments );
    }

    if ( !isUndefined( obj ) ) {
      each[ isArray( obj ) ? "apply" : "call" ]( undefined, obj );
      respond( null );      
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

    fab.status[ code ] = function( respond ) {
      respond( code )( code + " error" )( null );
    }
  })
});

// create fab constructors
fab.each(
  "request response url cookie".split(" "),
  function( i, name ) {
    fab[ name ] = function() {
      return fab[ name ].prototype.init.apply( this, arguments );
    };
  }
);

fab.log = function() { throw "Not implemented." }