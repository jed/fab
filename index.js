if ( typeof process == "object" && process.ARGV[ 0 ] == "node" ) {
  fab = module.exports = require( "./lib/node" );
}