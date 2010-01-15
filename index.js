// is there a better way to sniff for node?
if ( typeof process == "object" && "version" in process )
  exports.fab = require( "./node" ).fab;