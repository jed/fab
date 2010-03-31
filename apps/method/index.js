exports.method = ( function( names, name ) {
  while ( name = names.pop() ) method[ name ] = method( name );
    
  return method;

  function method() {
    var
      methods = {},
      len = arguments.length;
    
    for ( var i = 0; i < len; i++ ) {
      methods[ arguments[ i ] ] = true;
    }
      
    return function() {
      var hit = arguments[ 0 ];
  
      return function() {
        var miss = arguments[ 0 ] || fab.status( 405 )();
  
        return function( respond ) {
          return function( head ) {
            var app = head.method in methods ? hit : miss;
            
            app = app( respond );
            if ( app ) app = app( head );
            
            return app;
          }
        }
      }
    }
  }
})( "HEAD GET POST PUT DELETE TRACE OPTIONS CONNECT".split( " " ) )