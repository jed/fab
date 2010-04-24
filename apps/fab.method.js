exports.summary = "Takes one more more method names, and returns a ternary app that passes the request to the first app when the request method matches, and to the second app otherwise.";

method = exports.app = ( function( names ) {
  for ( var name; name = names.pop(); ) method[ name ] = method( name );
    
  return method;

  function method() {
    var
      methods = {},
      len = arguments.length;
    
    for ( var i = 0; i < len; i++ ) {
      methods[ arguments[ i ] ] = true;
    }
      
    return function( hit ) {
      return function( miss ) {
        return function() {
          var out = this;
          return function( head ) {
            var app = head.method in methods ? hit : miss;
            
            app = app.call( out );
            if ( app ) app = app( head );
            
            return app;
          }
        }
      }
    }
  }
})( [ "GET", "POST", "PUT", "DELETE" ] );

exports.tests = ( function() {
  var ok = function(){ this({ body: true }) }
    , notok = function(){ this({ body: false }) }
    , app = method( "GET" )( ok )( notok );

  return [

    function
    methodMatchesGetCorrectly() {
      var out = this;
      app.call( function( obj ){ out( obj.body ) } )({ method: "GET" });
    },

    function
    methodMismatchesPostCorrectly() {
      var out = this;
      app.call( function( obj ){ out( !obj.body ) } )({ method: "POST" });
    }
  
  ];
  
})();