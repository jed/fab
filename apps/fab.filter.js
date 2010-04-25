exports.summary = "Turns a function into a binary app that only sends responses that satisfy the function.";

exports.app = function( fn ) {
  return function( app ) {
    return function() {
      var out = this;
      return app.call( function listener( obj ) {
        if ( !obj || fn.call( obj, obj ) ) {
          out = out.apply( this, arguments );
        }
        
        return listener;
      })
    }
  }
}