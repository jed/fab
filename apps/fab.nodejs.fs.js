exports.name      = "fab.nodejs.fs";

exports.summary   = "Fetches a file from the file system based on the path in the upstream response."

exports.details   = "The path used to fetch the file is obtained from the response, as the pathname property of the url object first, or the body property otherwise.";

exports.requires  = [ "fab.nodejs" ];

exports.app = function( app ) {
  var fs = require( "fs" );

  return function() {
    var out = this;

    return app.call( function listener( obj ) {
      if (obj) {
        var path = obj.url ? obj.url.pathname : obj.body
          , body = "File not found: " + path || "No path given."
          , notfound = { status: 404, body: body };

        if ( !path ) {
          out = out( err );
          if ( out ) out();
        }

        else fs.readFile( path, "utf8", function( err, data ) {
          out = out( err ? notfound : { status: 200, body: data } );
          if ( out ) out();
        });
      }
      return listener;
    })
  }
}
