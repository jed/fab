var fab = { map: require( "./fab.map" ).app };

exports.summary = "A ternary app that compiles the string response of the first app into a template function that maps subsequent responses from the second app.";

exports.app = function( source ) {
  var fn;

  source.call( function( obj ) {
    fn = new Function(
      "var p=[];p.push('" +
      obj.body
        .replace( /[\r\t\n]/g, " " )
        .replace( /'(?=[^%]*%>)/g, "\t" )
        .split( "'" ).join( "\\'" )
        .split( "\t" ).join( "'" )
        .replace( /<%=(.+?)%>/g, "',$1,'" )
        .split( "<%" ).join( "');" )
        .split( "%>" ).join( "p.push('" )
        + "');return p.join('');" );
  });
  
  return function( app ) {
    // TODO: fn might not be defined yet for async
    app = fab.map( function( obj ) {
      obj.body = fn.call( obj.body );
      return obj;
    })( app );

    return function() { return app.call( this ) };
  }
}