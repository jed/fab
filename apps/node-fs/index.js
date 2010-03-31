exports.fs = function() {
  var
    fs = require( "fs" ),
    path = require( "path" ),
    sys = require( "sys" ),
    root = arguments[ 0 ] || process.cwd();

  return function( back ) {
    return function( head ) {
      if ( head.method !== "GET" ) {
        // TODO: support PUT and DELETE
        return back({ status: 405 })();
      }
      
      var pathname = path.join( root, head.url.pathname ); 
      
      fs.readFile( pathname, "utf8", function( err, data ) {
        back( err ? { status: 404 } : { body: data } )();
      })
    }
  }
}