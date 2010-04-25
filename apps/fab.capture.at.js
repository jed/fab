exports.summary = "A binary app that responds with the captured url component at the given position.";

var fab = {
  map: require( "./fab.map" ).app,
  capture: require( "./fab.capture" ).app
};

exports.app = function( pos ) {
  pos.call( function( obj ){ pos = obj.body } );
  
  return fab.map( function( obj ) {
    return { body: obj.body[ pos ] };
  })( fab.capture );
}