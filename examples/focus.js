var
  fab = require( "../" ),
  listeners = [];
  
module.exports = fab

  ( /\/listen/ )
    ( function(){ listeners.push( this ) } )
    
  ( /\/init/ )
    ( fab.tmpl, "(<%= this %>)()" )
    ( client.toString() )
    
  ( /\/focused/ )
    ( broadcast, listeners )
    ( fab.tmpl, "$('body').html('<%= this %>');" )
    ( userAgent )
  
  ( fab.tmpl, "<html><body style='font: bold 5em helvetica'><%= this %></body></html>" )
  
  (
    "<script src='http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js'></script>" +
    "<script src='/browserFocus/init'></script>"
  );

function broadcast( listeners ) {
  listeners.call( function( obj ){ listeners = obj.body } );

  return function( app ) {
    return function() {
      this();
  
      return app.call( function fn( obj ) {
        var i = listeners.length;
  
        while ( i-- ) {
          ( obj ? listeners[ i ] : listeners.pop() ) 
            .apply( this, arguments );
        }
  
        return fn;
      })
    }
  }
}

function userAgent() {
  var out = this;
  return function( head ) {
    var ua = head.headers[ "user-agent" ];

    out({ body:
      ~ua.indexOf( "Firefox" ) ? "Firefox" :
      ~ua.indexOf( "Chrome" ) ? "Chrome" :
      ~ua.indexOf( "Safari" ) ? "Safari" :
      "Other"
    })();
  }
}

function client() {
  ( function listen(){ $.getScript( "/browserFocus/listen", listen ) })();
  $( window )
    .focus( function(){ $.getScript( "/browserFocus/focused" ) } )
    .focus();
}
