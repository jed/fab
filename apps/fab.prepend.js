exports.name      = "fab.prepend";
exports.summary   = "Prepends responses with the given string.";
exports.requires  = [ "fab.map" ];

var fab = { map: require( "./fab.map" ).app };

exports.app = function( str ) {
  str.call( function( obj ){ str = obj.body } );
  
  return fab.map( function( obj ) {
    obj.body = str + obj.body;
    return obj;    
  });
}