;( function() {

  var global = this,

      http = require( "http" ),
      sys = require( "sys" ),

      statuses = {
        100: "Continue",
        101: "Switching Protocols",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        300: "Multiple Choices",
        301: "Moved Permanently",
        302: "Moved Temporarily",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Time-out",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Large",
        415: "Unsupported Media Type",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Time-out",
        505: "HTTP Version Not Supported"
      },

      methods = [
        "HEAD",
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "TRACE",
        "OPTIONS",
        "CONNECT"
      ];
      
  exports.fab = fab;
  
  // for prototypal inheritance
  function dummyFn(){};
  function create( from ) {
    dummyFn.prototype = from || this;
    return new dummyFn;
  };

  // make iteration easier, c/o jQuery
  function each( object, callback ) {
    var name, i = 0, length = object.length;
    
    if ( length === undefined ) {
      for ( name in object )
        if ( callback.call( object[ name ], name, object[ name ] ) === false )
          break;
    } else
      for ( var value = object[0];
        i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}

    return object;
  };
    
  // core fab object    
  function fab( arg1, arg2 ) {

    if ( this.constructor != fab )
      return fab.apply( make(), arguments );
      
    if ( !arg1 )
      return this.ls[ "../" ] || this;

    if ( arg1.constructor === env )
      return handle.call( this, arg1 );

    if ( arg1.constructor === Function ) {
      this.handler = arg1;
      return this;
    }
      
    if ( arg1.constructor === Number ) {
      this.statuses[ arg1 ] = arg2;
      return this;
    }

    if ( arg1.constructor === String )
      arg1 = arg1.replace( /[.?]/g, "\\$&");
  
    if ( arg1.constructor === RegExp )
      arg1 = arg1.source;

    if ( arg1.constructor !== String )
      throw "inavlid params";
      
    if ( arguments.length == 1 )
      return append.call( this, arg1 );
      
    append.call( this, arg1 ).handler = arg2;
    return this;
  };

  fab.fn = fab.prototype = {};  
  fab.create = create;

  // add default error handlers and corresponding methods
  each( statuses, function( code, message ) {
    statuses[ code ] = function() {
      this._response.status = code;
      this
        .body( [
          "<html>",
            "<title>", code, ": ", message, "</title>",
            "<body>", code, ": ", message, "</body>",
          "</html>"
        ].join("") )
        .flush();
    };

    fab.fn[ code ] = function() {
      var args = [ +code ];
      args.push.apply( args, arguments );
      this.apply( this, args );
      return this;
    };

  });
  
  function handle( env ) {
    var args = arguments,
        path = env._request.location.pathname,
        length = path.length,
        lastFab = this,
        thisFab, match, handler, ret;

    each( this.ls, function( route ) {
      // TODO: cache these regexps
      match = path.match( RegExp( "^" + route ) );
      if ( !match )
        return true;

      lastFab = this;
      path = path.substr( match[ 0 ].length );
      
      Array.prototype.push.apply(
        env._request.captures, match.slice( 1 )
      );
      
      !path.length
        ? thisFab = this
        : each( this.ls, arguments.callee );
              
      return false;
    });
    
    handler = thisFab
      ? thisFab.handler || thisFab.statuses[ 501 ]
      : lastFab.statuses[ 404 ];
      
    if ( typeof handler == "number" )
      handler = thisFab.statuses[ handler ].call( env );

    if ( typeof handler == "function" )
      handler = handler.call( env );

    if ( typeof handler == "string" )
      env.body( handler );
    
    env.flush();
  };
  
  function append( path ) {
    var child = this.ls[ path ] = make();

    child.ls[ "../" ] = this;
    child.statuses = create( this.statuses );
    
    return child;
  };

  function make() {
    var fn = fab.prototype,
        ret = function() {
          return fab.apply( arguments.callee, arguments );
        };

    ret.constructor = fab;
    ret.ls = {};
    ret.statuses = statuses;

    for ( var name in fn )
      ret[ name ] = fn[ name ];      

    return ret;
  };

  // env to represent a request/response pair
  fab.env = env;
  function env() {
    var self = create( env.fn );
    self.constructor = env;
    return env.fn.init.apply( self, arguments );  
  };

  env.fn = env.prototype = {

    header: function( name, val ) {
      if ( val === undefined )
        return this._request.headers[ name ];
        
      this._response.headers[ name ] = val;
      return this;
    },

    status: function( val ) {
      if ( val === undefined )
        return this._response.status;
        
      this._response.status = +val;
      this.fab.statuses[ val ].apply( this, this._arguments );
      
      return this;    
    },
    
    location: function( name, val ) {
      if ( val === undefined )
        return this._request.location[ name ];
          
      this._response.location[ name ] = val;
      this._redirect = true;
      return this;    
    },

    cookie: function( name, val, options ) {
      if ( val === undefined )
        return this._request.cookies[ name ];
      
      options = options || {};
      options.value = val;
      options.path = options.path || "/";

      this._response.cookies[ name ] = options;
      return this;    
    },

    param: function( name, val ) {
      if ( val === undefined )
        return this._request.params[ name ];
    
      this._response.params[ name ] = val;
      this._redirect = true;      
      return this;
    },

    capture: function( pos, val ) {
      if ( val === undefined )
        return this._request.captures[ +pos ];
        
      this._response.captures[ +pos ] = val;
      this._redirect = true;      
      return this;
    },

    body: function( val ) {
      this._response.body = val.toString();
      return this;
    }
  }

  // init "constructor", specific to node.js
  fab.env.fn.init = function( req, res ) {
    var hostPort = req.headers.host.split( ":" ),
        cookieHeader = req.headers["cookie"],
        cookies = {};
        
    if ( cookieHeader )
      cookieHeader.split(";").forEach( function( cookie ) {
        var parts = cookie.split("="),
            name = parts[0].trim(),
            value = parts[1].trim();
            
        cookies[ name ] = value;
      });
        
    this._request = {
      method: req.method,
  
      headers: req.headers,
      cookies: cookies,
  
      location: {
        hash: req.uri.fragment,
        host: hostPort[0],
        href: "http://" + req.headers.host + req.uri.full,
        hostname: req.headers.host,
        pathname: req.uri.path,
        port: hostPort[1],
        protocol: "http:",
        search: req.uri.queryString
      },
      captures: { length: 0 },
      params: req.uri.params,
  
      original: req
    };
    
    this._response = {
      status: 200,
  
      headers: { "content-type": "text/html; charset=UTF-8" },
      cookies: {},
  
      location: fab.create( this._request.location ),
      captures: fab.create( this._request.captures ),
      params: fab.create( this._request.params ),
  
      body: "",
  
      original: res
    };
    
    this._redirect = false;
    
    return this;
  };
  
  // flush method, specific to node.js
  fab.env.fn.flush = function() {
    var res = this._response,
        original = res.original,
        cookies = res.cookies;
  
    res.headers[ "content-length" ] = process._byteLength( res.body );
    renderCookies();
    
    if ( this._redirect ) {
      res.status = 302;
      res.headers[ "location" ] = buildUrl();
    }
    
    original.sendHeader( res.status, res.headers );
    original.sendBody( res.body, "utf-8" );
    original.finish();
    
    function buildUrl() {
      var loc = res.location,
          url = [ loc.protocol, "//" ],
          name, queryString = [];

      if ( loc.hasOwnProperty( "href" ) )
        return loc.href;
          
      if ( loc.hasOwnProperty( "hostname" ) )
        url.push( loc.hostname )

      else {
        url.push( loc.host );
        if ( loc.port )
          url.push( ":", loc.port );
      }
      
      // TODO: figure out a way to replace regex captures
      url.push( loc.pathname );
      
      if ( loc.hasOwnProperty( "search" ) )
        queryString.push( "?", loc.search )

      else
        for ( name in res.params )
          queryString.push(
            queryString.length ? "&" : "?",
            name, "=", res.params[ name ]
          );
  
      url.push.apply( url, queryString );

      if ( loc.hash )
        url.push( "#", loc.hash );
        
      return url.join("");    
    }
    
    function renderCookies() {
      var ret, name, options;
  
      for ( name in cookies ) {
        ret = [];
          
        ret.push( name, "=", cookies[ name ].value )
        
        options = cookies[ name ];
      
        if ( options.expires )
          ret.push( "; expires=", options.expires.toUTCString() );
            
        if ( options.path )
          ret.push( "; path=", options.path );
        
        if ( options.domain )
          ret.push( "; domain=", options.domain );
      
        if ( options.secure )
          ret.push( "; secure" );
          
        res.headers[ "set-cookie-" + name ] = [ "set-cookie", ret.join("") ];
      }
    }
  };
  
  // deploy method, specific to node.js
  fab.fn.deploy = function( server ) {
    var http = require( "http" ),
        self = this;

    if ( !server )
      server = 0xFAB;
  
    if ( typeof server == "number" )
      http.createServer( handler ).listen( server )
      
    else if ( server instanceof http.Server )
      server.addListener( "request", handler );
      
    else sys.error( "Unsupported deployment target." )
    
    return this;
    
    function handler( req, res ) {
      self( fab.env( req, res ) );
    }
  }

})();