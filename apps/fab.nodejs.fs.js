exports.summary = "A binary app that fetches a file from the file system based on the path in the upstream response.";

exports.app = function( app ) {
  var fs = require( "fs" );
    
  return function() {
    var out = this;

    return app.call( function( obj ) {
      var path = obj.body;

      fs.readFile( path, "utf8", function( err, data ) {
        out({
          body: data || "File not found: " + path,
          status: err ? 404 : 200
        })();
      });    
    })
  }
}