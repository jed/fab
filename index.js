module.exports = fab = function() {
  var drain;
  
  return function fab( write ) {
    return function read( obj ) {
      if ( drain ) return drain( obj );
      
      if ( obj && obj.apply ) {
        var fn = obj;
        arguments[ 0 ] = write;
        return fab( fn.apply( undefined, arguments ) );
      }
      
      write = write.apply( undefined, arguments );
      return read;      
    }
  }( fab.stream( function( x ){ drain = x } ) )
    .apply( undefined, arguments );
}

fab.stream = function stream( write, queue ) {
  queue = queue || [];
  
  var length = queue.length;
  
  function drain( write, req ) {    
    for ( var i = 0; i < length; ) {
      write = write.apply( undefined, queue[ i++ ] );
    }

    return write;
  };
  
  return function read() {
    if ( !arguments.length ) return write ? write( drain ) : drain;

    queue[ length++ ] = arguments;
    return read;
  }
}

fab.listen = function( write, port ) {
  var url = require( "url" );

  return fab.stream( function read( stream ) {
    require( "http" )
      .createServer( listener( stream ) )      
      .listen( port );
    
    return stream( write );
  });
  
  function listener( stream ) {
    return function( req, res ) {
      var status = 200
        , headers = {};
        
      stream( fab.render( read, {
        method: req.method,
        headers: req.headers,
        url: url.parse( "//" + req.headers.host + req.url )
      }))();
        
      function read( body, head ) {
        
        if ( !arguments.length ) res.end();
  
        else {
          if ( head ) {
            if ( "status" in head ) status = head.status;
            
            if ( "headers" in head ) {
              for ( var name in head.headers ) {
                headers[ name ] = head.headers[ name ]
              }
            }
          }
  
          if ( body ) {
            if ( headers ) {
              res.writeHead( status, headers );
              headers = undefined;
            }
            
            res.write( body.toString() );
          }
        }
  
        return read;
      }
    }
  }
}

fab.route = function() {
  var slice = Array.prototype.slice;

  route.capture = function( write, i ) {
    return write( function( write, head ) {
      var capture = head.url.capture || [];
      return write( i >= 0 ? capture[ i ] : capture );
    });
  }

  return route;
  
  function route( write, pattern ) {
    return fab.stream( function( yes ) {
      return fab.stream( function( no ) {
        return write( function( write, head ) {
          var app = no
            , url = head.url
            , pathname = url.pathname;

          if ( pattern.test( pathname ) ) {
            app = yes;
            
//             not sure why this doesn't work.
//             head = Object.create( head );
//             head.url = Object.create( head.url );
            head.url.pathname = pathname.replace( pattern, function() {
              url.capture = ( url.capture || [] )
                .concat( slice.call( arguments, 1, -2 ) );
                
              return "";
            });
            
          }
          
          return app( write, head );
        })();
      });
    });
  }
}();

fab.method = function() {
  var names = "GET PUT POST DELETE HEAD".split( " " );

  function method( write, name ) {
    return fab.stream( function( yes ) {
      return fab.stream( function( no ) {
        return write( function( write, head ) {
          return ( head.method == name ? yes : no )( write, head );
        })();
      });
    });
  }
  
  for ( var i = 5; i--; ) ( function( name ) {
    method[ name ] = function( write ) {
      return method( write, name );
    }
  })( names[ i ] );
  
  return method;
}();


fab.render = function( write ) {
  var args = [].slice.call( arguments );

  return function read( obj ) {
    if ( obj && obj.apply ) {
      args[ 0 ] = read;
      return obj.apply( undefined, args );
    }
    
    write = write.apply( undefined, arguments );

    return arguments.length ? read : write;
  }
}

fab.log = function( write, msg ) {
  if ( msg ) {
    console.log( msg );
    return write;
  }

  return function read( body ) {
    console.log( body );
    write = write.apply( undefined, arguments );
    return arguments.length ? read : write;
  }
}

fab.concat = function( write ) {
  var buffer = "";

  return function read( obj ) {
    if ( typeof obj == "string" ) buffer += obj;

    else {
      if ( buffer ) write = write( buffer );
      
      buffer = "";
      write = write.apply( undefined, arguments );
    }
    
    return arguments.length ? read : write;
  }
}

fab.html = function() {
  var tags = [

// open
"A ABBR ADDRESS ARTICLE ASIDE AUDIO B BB BDO BLOCKQUOTE BODY BUTTON\
 CANVAS CAPTION CITE CODE COLGROUP DATAGRID DATALIST DD DEL DETAILS\
 DFN DIALOG DIV DL DOCTYPE DT EM EVENTSOURCE FIELDSET FIGURE FOOTER\
 FORM H1 H2 H3 H4 H5 H6 HEAD HEADER HTML I IFRAME INS KBD LABEL\
 LEGEND LI MAP MARK MENU METER NAV NOSCRIPT OBJECT OL OPTGROUP\
 OPTION OUTPUT P PRE PROGRESS Q RP RT RUBY SAMP SCRIPT SECTION\
 SELECT SMALL SPAN STRONG STYLE SUB SUP TABLE TBODY TD TEXTAREA\
 TFOOT TH THEAD TIME TITLE TR UL VAR VIDEO".split( " " ),

// closed
"AREA BASE BR COL COMMAND EMBED HR IMG INPUT KEYGEN LINK META PARAM\
 SOURCE WBR".split( " " )

    ];
  
  for ( var isVoid = 0, names; names = tags[ isVoid ]; isVoid++ ) {
    for ( var i = 0, name; name = names[ i++ ]; ) {
      elem[ name ] = elem( name.toLowerCase(), !!isVoid );
    }
  }
  
  elem.DOCTYPE = function( write, dec ) {
    return fab.concat( write )( "<!DOCTYPE " )( dec )( ">" );
  }

  elem.COMMENT = function( write ) {
    write = fab.concat( write )( "<!-- " );
    
    return function read( obj ) {
      if ( !arguments.length ) return write( " -->" );
      write = write( obj );
      return read;    
    }
  }
  
  return elem;
  
  function elem( name, isVoid ) {
    return function( write, obj ) {
      write = fab.concat( write )
      write = write( "<" + name ); 
      write = attrs( write )( obj )( ">" );
      
      if ( isVoid ) return write;
    
      return function read( arg ) {
        if ( !arguments.length ) return write( "</" + name + ">" );
        
        write = write.apply( undefined, arguments );
        return read;
      };
    }
  }
  
  function attrs( write ) {
    return function read( obj ) {
      for ( var name in obj ) {
        write = write( " " )( name )( "=" );
        write = attr( write )( obj[ name ] );
      }
    
      return write;
    }
  }
  
  function attr( write ) {
    return function read( value ) {
      return write( "\"" )( value )( "\"" );
    }
  }
}()