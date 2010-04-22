exports.summary = "Turns a function into a binary app that maps responses from the upstream app.";

exports.app = function( fn ) {
  return function( app ) {
    return function() {
      var out = this;
      return app.call( function listener( obj ) {
        if ( obj ) arguments[ 0 ] = fn.call( obj, obj );      
        out = out.apply( this, arguments );
        
        return listener;
      })
    }
  }
}