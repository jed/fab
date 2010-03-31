exports.path = function() {
  var
    pattern = arguments[ 0 ],
    match = {
      String: function( url ) {
        var path = url.pathname;

        if ( path.indexOf( pattern ) ) return;

        url.pathname = path.substr( pattern.length );
        return url;
      },
      
      RegExp: function( url ) {
        var path = url.pathname, matched;

        if ( path.search( pattern ) ) return;
        
        matched = path.match( pattern );
        
        url.pathname = path.substr( matched.shift().length );
        url.capture = url.capture || [];
        url.capture.push.apply( url.capture, matched );
        return url;
      }
    }[ pattern.constructor.name ];
    
  return function() {
    var hit = arguments[ 0 ];

    return function() {
      var miss = arguments[ 0 ] || fab.status( 404 )();

      return function( respond ) {
        return function( head ) {
          var
            app = miss,
            url = match( head.url );
          
          if ( url ) {
            head.url = url;
            app = hit;
          }
          
          app = app( respond );
          if ( app ) app = app( head );
          
          return app;
        }
      }
    }
  }
}