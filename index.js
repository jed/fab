var
  fs = require( "fs" ),
  path = require( "path" ),
  pathname = path.join( __dirname, "fab.js" );

eval( fs.readFileSync( pathname ) );

module.exports = fab;