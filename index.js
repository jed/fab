// is there a better way to sniff for node?
if ( typeof module == "object" && "exports" in module )
  module.exports = require( "./node" );