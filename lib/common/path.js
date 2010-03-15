function() {
  var
    pattern = arguments[ 0 ],
    length = pattern.length;

  return function() {
    var hit = arguments[ 0 ];

    return function() {
      var miss = arguments[ 0 ] || fab.status( 404 )();

      return function( respond ) {
        return function( head ) {
          var app = miss;
          
          if ( !head.url.indexOf( pattern ) ) {
            head.url = head.url.substr( length );
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