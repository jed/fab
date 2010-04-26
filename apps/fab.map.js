exports.name      = "fab.map";
exports.summary   = "Maps responses from the upstream app.";
exports.requires  = [];

map = exports.app = function( fn ) {
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

exports.tests = ( function() {
  var fn = function( obj ) { return { body: JSON.stringify( obj ).length } }
    , upstream = function(){ this({ body: { a: new Date } }) }
    , binary = map( fn )
    , unary = binary( upstream );

  return [

    function
    mapReturnsNaryApp() {
      this( binary.length !== 0 )
    },
    
    function
    mapRespondsWithCorrectPayload() {
      var out = this;
      unary.call( function( obj ) {
        out( obj.body === JSON.stringify({ body: { a: new Date }}).length ) }
      );
    }
  ];
  
})();