// this is just a placeholder, but will be the chaining function
// for the fab DSL, just like on the server version
fab = function( obj ) { return obj }

// this is basically an async/functional version of deep 'extend'
fab.member = function member( obj, key ) {
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

fab.dom = function() {
  var methods = {
    1: "createElement",
    3: "createTextNode",
    8: "createComment",
    11: "createDocumentFragment"
  }

  // like jQuery's $.fn.init, fab.dom is the swiss-army knife of (fab).
  // it takes any input and coerces it into a DOM node. there is no API:
  // just set the properties you would set on an ordinary DOM node, like
  // nodeName, nodeValue, childNodes, style, etc.
  function dom( arg ) {
    var ret, win = ( this == fab ? window : this );
  
    if ( arguments.length > 1 ) return dom.call( win, { childNodes: arguments } )
    
    if ( arg == null ) arg = {}

    if ( arg.nodeType && !hasOwnProperty( arg, "nodeType" ) ) return arg

    if ( arg.callee || arg.unshift ) return dom.apply( win, arg )

    if ( arg.apply ) return arg( update( ret = dom.call( win, arg() ) ) ), ret

    if ( typeof arg != "object" ) {
      arg = ( arg += "" ).indexOf( "<!--" )
        ? { nodeValue: arg }
        : { nodeValue: arg.substr( 4 ).replace( /-->$/, "" ), nodeType: 8 }
    }
    
    arg.nodeType || ( arg.nodeType = arg.nodeName ? 1 : arg.nodeValue ? 3 : 11 )
    
    ret = win.document[ methods[ arg.nodeType ] ]
      ( arg.nodeType == 1 ? arg.nodeName || "div" : arg.nodeValue )
      
    if ( arg.childNodes ) {
      for ( var i = 0; i < arg.childNodes.length; ) {
        ret.appendChild( dom.call( win, arg.childNodes[ i++ ] ) )  
      }
    }

    fab.member( ret )( arg )        
    
    return ret;    
  }

  // fab.dom.update takes a functional approach to DOM manipulation.
  // it takes a nodelist, and returns a function which replaces the lists
  // contents, and then returns another function that replaces the new contents.
  dom.update = update
  function update( first ) {
    var before = arguments
  
    if ( first.nodeType == 11 ) {
      first.firstChild || first.appendChild( first.ownerDocument.createComment("") )
      before = [].slice.call( first.childNodes )
    }
  
    return function() {
      var after = dom.apply( this, arguments )
        , next = update( after )
        , i = 0, el, parent
      
      while ( el = before[ i++ ] ) {
        ( parent = el.parentNode ) && after 
          ? after = !parent.replaceChild( after, el )
          : parent.removeChild( el )
      }
      
      return next;
    }
  }
  
  return dom
}()

// (fab) auto-executes for any content in its own tag or in tags with
// type="text/fab". any node returned by code contained in a tag replaces
// the tag itself. what's cool about this is you can use (fab) to render
// an entire document, or just any node within it.
new function() {
  var scripts = document.getElementsByTagName( "script" )
    , i = scripts.length
    , script
    
  while ( script = i-- && scripts[ i ] ) {
    ( script.type == "text/fab" || /\bfab\.js$/.test( script.src ) ) &&
      Function( "f", "with(fab)f " + script.innerHTML )( fab.dom.update( script ) )
  }  
}