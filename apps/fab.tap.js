exports.name      = "fab.tap";
exports.summary   = "Executes the given function when called, and then connects the downstream and upstream apps.";
exports.requires  = [];

exports.app = function( fn ) {
  return function( app ) {
    return function() {
      fn();
      return app.call( this );    
    }
  }
}