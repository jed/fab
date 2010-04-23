module.exports = function( apps ) {
  var tests = []
    , ret = {}
    , dir = require( "path" ).join( __dirname, "../apps/");
  
  apps.forEach( function( name ) {
    var name
      , parent = ret
      , parts = name.split( "." )
      , app = require( dir + name );
      
    while ( parts.length > 1 )
      { parent = parent[ parts.shift() ] }
      
    parent[ parts.shift() ] = app.app;
    tests.push.apply( tests, app.tests || [] );
  });
  
  ret.tests = tests;
  ret.app = ret.fab;
  
  return ret;
}