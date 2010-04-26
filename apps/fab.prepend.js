exports.summary = "A ternary app that prepends responses with the given string.";

var fab = { map: require( "./fab.map" ).app };

exports.app = function( str ) {
  str.call( function( obj ){ str = obj.body } );
  
  return fab.map( function( obj ) {
    obj.body = str + obj.body;
    return obj;    
  });
}