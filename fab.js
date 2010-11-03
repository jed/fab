fab = function() {
  function fab( arg ) {
    var doc = this.document
  
    if ( !arguments.length ) return append( doc.createDocumentFragment() )
  
    if ( typeof arg == "function" ) {
      var fn = arg
  
      arg = function(){ return update( arg ).apply( this, arguments ) }
      arg = fn.apply( this, arguments ) || doc.createComment( fn.name || "anonymous" )
      
      if ( typeof arg == "function" ) return function fn() {
        arg = arg.apply( this, arguments )
        return typeof arg == "function" ? fn : arg
      }
    }
    
    if ( arg.callee || arg.unshift ) {
      var list = arg
      
      arg = doc.createDocumentFragment()

      for ( var i = 0; i < list.length; ) arg.appendChild( fab( list[ i++ ] ) )  
    }
  
    if ( arg.nodeType && !hasOwnProperty( arg, "nodeType" ) ) return arg
  
    arg = ( arg += "" ).indexOf( "<!--" )
      ? doc.createTextNode( arg )
      : doc.createComment( arg.substr( 4 ).replace( /-->$/, "" ) )
      
    return arg
  }
  
  function append( parent ) {
    return function read( arg ) {
      if ( !arguments.length ) return parent
      
      arg = fab.apply( this, arguments )
  
      if ( typeof arg == "function" ) return function fn() {
        arg = arg.apply( this, arguments )
        return typeof arg == "function" ? fn : read( arg )
      }
      
      parent.appendChild( arg )
      return append( parent )
    }
  }
  
  function member( obj, key ) {
    return function assign( val ) {
      switch ( typeof val ) {
        case "function":
          assign( val( assign ) )
          break
          
        case "object":
          key && ( obj = obj[ key ] )
          for ( key in val ) member( obj, key )( val[ key ] )
          break
          
        default:
          obj[ key ] = val
          return assign // TODO: avoid potential memory leak for unbound fns
      }
    }
  }
  
  function update( first ) {
    var before = arguments
  
    if ( first.nodeType == 11 ) {
      first.firstChild || first.appendChild( first.ownerDocument.createComment("") )
      before = [].slice.call( first.childNodes )
    }
  
    return function() {
      var after = fab( arguments )
        , next = update( after )
        , i = 0, el, parent
      
      while ( el = before[ i++ ] ) ( parent = el.parentNode ) && after 
        ? after = !parent.replaceChild( after, el )
        : parent.removeChild( el )
      
      return next;
    }
  }
  
  !function() {
    for ( var list, i = 2; list = i-- && arguments[ i ].split( " " ); ) {
      for ( var j = list.length; j--; ) !function( name, isVoid ) {
        fab[ name ] = function( cb, attrs ) {
          var el = document.createElement( name )
          
          member( el )( attrs )
          
          return isVoid ? el : append( el )
        }
      }( list[ j ], !i )
    }
  }(
    // closed
      "AREA BASE BR COL COMMAND EMBED HR IMG INPUT KEYGEN LINK META PARAM SOURCE WBR",
    // open
      "A ABBR ADDRESS ARTICLE ASIDE AUDIO B BB BDO BLOCKQUOTE BODY BUTTON CANVAS CAPTION CITE CODE COLGROUP DATAGRID DATALIST DD DEL DETAILS DFN DIALOG DIV DL DOCTYPE DT EM EVENTSOURCE FIELDSET FIGURE FOOTER FORM H1 H2 H3 H4 H5 H6 HEAD HEADER HTML I IFRAME INS KBD LABEL LEGEND LI MAP MARK MENU METER NAV NOSCRIPT OBJECT OL OPTGROUP OPTION OUTPUT P PRE PROGRESS Q RP RT RUBY SAMP SCRIPT SECTION SELECT SMALL SPAN STRONG STYLE SUB SUP TABLE TBODY TD TEXTAREA TFOOT TH THEAD TIME TITLE TR UL VAR VIDEO"
  )
  
  !function() {
    var doc = document
      , scripts = doc.getElementsByTagName( "script" )
      , i = scripts.length
      , script
      
    while ( script = i-- && scripts[ i ] ) {
      if ( script.type == "text/fab" || /\bfab\.js$/.test( script.src ) ) {
        var el = eval( "with(fab)fab " + script.innerHTML )
          , name = el.nodeName.toLowerCase()
        
        update(
          name == "html" ? doc.documentElement :
          name == "body" ? doc.body : script
        )( el )
      }
    }
  }()

  return fab
}()