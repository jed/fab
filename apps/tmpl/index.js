exports.tmpl = function( str ) {
  var fn = new Function( "obj",
    "var p=[],print=function(){p.push.apply(p,arguments);};" +
    "with(obj){p.push('" +
    str.replace( /[\r\t\n]/g, " " )
       .replace( /'(?=[^%]*%>)/g, "\t" )
       .split( "'" ).join( "\\'" )
       .split( "\t" ).join( "'" )
       .replace( /<%=(.+?)%>/g, "',$1,'" )
       .split( "<%" ).join( "');" )
       .split( "%>" ).join( "p.push('" )
       + "');}return p.join('');" );
  
  return function() {
    var app = arguments[ 0 ];
    
    return function( back ) {    
      app( function handler( data ) {
        if ( data && data.body ) data.body = fn( data.body );
      
        back = data ? back( data ) : back();
        
        return handler;      
      });
    }
  }
};