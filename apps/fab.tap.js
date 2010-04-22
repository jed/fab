exports.summary = "A binary app that executes the given function when called, and then connects the downstream and upstream apps.";

exports.app = function( fn ) {
  return function( app ) {
    return function() {
      fn();
      return app.call( this );    
    }
  }
}