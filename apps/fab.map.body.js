exports.name      = "fab.map.body";
exports.summary   = "Maps response bodies from the upstream app.";
exports.requires  = [];

exports.app = function( fn ) {
  return function( app ) {
    return function() {
      var out = this;
      return app.call( function listener( obj ) {
        var body = obj && obj.body;
        if ( body ) arguments[ 0 ].body = fn.call( body, body );
        out = out.apply( this, arguments );
        
        return listener;
      })
    }
  }
}