[ "fab"
  , "fab.tmpl"
  , "fab.body"
  , "fab.capture"
  , "fab.echo"
  , "fab.Function"
  , "fab.identity"
  , "fab.map"
  , "fab.method"
  , "fab.nodejs"
  , "fab.nodejs.contentLength"
  , "fab.nodejs.fs"
  , "fab.nodejs.http"
  , "fab.Number"
  , "fab.path"
  , "fab.RegExp"
  , "fab.status"
  , "fab.stringify"
  , "fab.tap"

].forEach( function( name ) {
  var name
    , parent = exports
    , parts = name.split( "." )
    , app = require( "../apps/" + name );
    
  while ( parts.length > 1 )
    { parent = parent[ parts.shift() ] }
    
  parent[ parts.shift() ] = app.app;
});

exports.app = exports.fab;