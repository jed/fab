exports.name      = "fab";
exports.summary   = "Glues apps of various arities together.";
exports.requires  = [ "fab.defaults.*, fab.identity" ];

exports.app = function fab() {
  var stack = [];
  
  return collect.apply( this, arguments );

  function collect( fn ) {
    var args = stack.slice.call( arguments )
      , length = args.length
      , defaults = fab.defaults;
    
    if ( !length ) fn = fab.identity;

    if ( length > 1 ) fn = fab( fn ).apply( this, args.slice( 1 ) );
    
    fn = ( fn && defaults[ fn.constructor.name ] || defaults )( fn );
    
    stack.unshift( fn );
    
    return reduce();
  }
  
  function reduce() {
    if ( stack[ 0 ].length ) return collect;

    if ( stack.length == 1 ) return stack.shift();
    
    if ( stack[ 1 ] == fab.identity ) {
      var app = stack[ 0 ];
      stack.splice( 1, 1 );
      reduce();
      stack.unshift( app );
    }
    
    stack.splice( 0, 2, stack[ 1 ]( stack[ 0 ] ) );
    return reduce();
  }
}