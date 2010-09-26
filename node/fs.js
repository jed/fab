module.exports = function( exports, imports ) {
  var fs = require( "fs" );

  return imports( function( stream, render, concat, ignore ) {
    return exports( function( write ) {
      return stream( function( path ) {
        return write( function( write, head, body ) {
          return stream( function( rest ) {
            return path( render( concat( function read( path ) {
              fs.createReadStream( path )
                .on( "data", function( body ){ write = write( body ) })
                .on( "end", function(){ rest( write, head, body ) })
                .on( "error", function(){ rest(
                  write( "File not found: " + path, { status: 404 } ), head, body
                )});
                
              return ignore;
            }, head, body ), head, body), head, body );
          });
        });
      });
    })
  }, "stream", "render", "concat", "ignore" )
}