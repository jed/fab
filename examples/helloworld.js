fab = require( "../" );

module.exports = fab

  ( /^\/hello/ )
  
    ( fab.tmpl, "Hello, <%= this[ 0 ] %>!" )

    ( /^\/(\w+)$/ )
      ( fab.capture )
      ( [ "world" ] )
  
  ( 404 );