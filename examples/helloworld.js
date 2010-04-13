fab = require( "../" );

module.exports = fab

  ( /\/hello/ )
  
    ( fab.tmpl, "Hello, <%= this[ 0 ] %>!" )

    ( /\/(\w+)/ )
      ( capture )
      ( [ "world" ] )
  
  ( 404 );

function capture() {
  var out = this;
  return function( head ) {
    out({ body: head.url.capture })();
  }
}