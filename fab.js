// the core function, doubling as namespace
function fab() {
  return function()
    { return fab.dispatch.apply( arguments.callee, arguments ) }
    ( fab.init, arguments );
};

fab.VERSION = "0.2.0";
fab.escapeRegExp = function( str ) {
  return str.replace( /[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&" );
}

// for commonJS module usage
if ( typeof exports !== "undefined" ) {
  exports.fab = fab;
}

// processing for a new fab
fab.init = function() {
  fab.extend( this, fab.prototype );
  this.last = this;
  
  this.nodes = [];
  this.method = {};

  this.handler = fab.handle;
  this.status = fab.status;
  
  return this( arguments );
}

// determine action based on arguments
fab.dispatch = function( first ) {
  if ( first instanceof fab.request ) {
    first.context = this;
    first.cursor = 0;
    first.url.pattern = "";
    return this.handler.call( first, arguments[ 1 ] );
  }
    
  if ( !first ) {
    return this.last;
  }
    
  if ( first.callee && typeof first.length === "number" ) {
    return this.apply( this, first );
  }

  if ( first === fab ) {
    return this( fab.end );
  }
    
  if ( typeof first === "string" || first instanceof RegExp ) {
    return fab.append.apply( this, arguments );
  }

  if ( typeof first === "function" ) {
    return first.apply( this, Array.prototype.slice.call( arguments, 1 ) );
  }
    
  throw "Unsupported signature.";
};

// add a new child to the current node
fab.append = function( pattern, fn ) {
  var
    flags = "",
    nodes = this.nodes,
    i = 0,
    matched = 0,
    child = fab();

  if ( typeof pattern === "string" ) {
    pattern = fab.escapeRegExp( pattern );
  }

  else if ( pattern instanceof RegExp ) {
    pattern = pattern.source;
    flags = pattern.toString().split( "/" ).pop();
  }
  
  pattern = pattern.replace( /^[^^]/, "^$&" );
  child.pattern = new RegExp( pattern, flags );
  child.last = this;
  child.status = fab.create( this.status );
  
  for ( var len = nodes.length, source; i < len; i++ ) {
    source = nodes[ i ].pattern.source;
    if ( source == pattern ) matched = 1;
    if ( source >= pattern ) break;
  }
  
  nodes.splice( i, matched, child );
  
  return typeof fn !== "undefined"
    ? child[ "GET" ]( fn ).last
    : child;
}

// default fab handler to perform routing
fab.handle = function( respond ) {
  var
    context = this.context,
    method = context.method,
    status = context.status,
    url = this.url,
    path = url.pathname.substr( this.cursor );

  if ( !path ) {
    return ( method[ this.method ] || method[ "*" ] || status[ 405 ] )
      .apply( this, arguments );
  }

  for ( var i = 0, next, match; next = context.nodes[ i++ ]; ) {
    match = path.match( next.pattern );
    if ( !match ) continue;

    this.context = next;
    this.cursor += match.shift().length;
    url.pattern += next.pattern.source.substr( 1 );
    if ( match.length ) {
      Array.prototype.push.apply( url.capture.original, match );
    }

    return next.handler.apply( this, arguments );
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
    
    if ( typeof fn === "function" ) {
      obj = fn.call( this, each );
    }
      
    if ( typeof obj === "function" ) {
      return obj;
    }

    if ( obj instanceof fab.url ) {
      each( 302, { "Location": obj.toString() }, "Moved to ", null );
      return;
    }
      
    if ( typeof obj === "number" ) {
      return this.context.status[ obj ].apply( this, arguments );
    }

    if ( typeof obj !== "undefined" ) {
      each[ typeof obj.length === "number" && !obj.substr ? "apply" : "call" ]( undefined, obj );
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

// each, adapted from jQuery
fab.each = function( obj, cb ) {
  var l = obj.length;

  if ( l === undefined || typeof obj === "function" ) {
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