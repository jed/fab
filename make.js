var
  sys = require( "sys" ),
  fs = require( "fs" ),
  path = require( "path" ),

  sourceDir = "lib",
  buildDir = "dist";
  
rm( buildDir, function() {

  fs.mkdirSync( buildDir, 0777 )
  
  fs
    .readdirSync( sourceDir )
    .forEach( function( buildname ) {
      var
        from = path.join( sourceDir, buildname ),
        to = path.join( buildDir, "fab-" + buildname + ".js" ),
        obj, str = "";
      
      if ( !fs.statSync( from ).isDirectory() ) return;
      
      obj = dirToObj( from );
      str = obj.index.join( "\n\n" );
      str += "\n\nfab.version = \"" + fs.readFileSync( "version.txt" ) + "\";";
      delete obj.index;
      
      for ( var fn in obj ) {
        str += "\n\nfab." + fn + " = " + obj[ fn ];
      }
      
      fs.writeFileSync( to, str );
    })

})
  
function dirToObj( dir ) {
  var ret = {}, name;

  fs
    .readdirSync( dir )
    .forEach( function( item ) {
      var itempath = path.join( dir, item );
      
      if ( fs.statSync( itempath ).isDirectory() ) {
        item = dirToObj( itempath );
        for ( name in item ) {
          ret[ name ] = ( ret[ name ] || [] ).concat( item[ name ] );
        }
      }

      else if ( fs.statSync( itempath ).isFile() ) {
        name = item.split( "." );
        if ( name[ 1 ] === "js" ) {
          ret[ name[ 0 ] ] = ( ret[ name[ 0 ] ] || [] ).concat( fs.readFileSync( itempath ) );
        }
      }
    })
    
  return ret;
}

// from http://github.com/isaacs/npm/blob/master/lib/utils/rm-rf.js
function rm (p, cb) {
  
  if (!p) return cb(new Error("Trying to rm nothing?"));
  
  fs.lstat(p, function (er, s) {
    if (er) return cb();
    if (s.isFile() || s.isSymbolicLink()) {
      fs.unlink(p, cb);
    } else {
      fs.readdir(p, function (er, files) {
        if (er) return cb(er);
        (function rmFile (f) {
          if (!f) {
            fs.rmdir(p, cb);
          } else {
            rm(path.join(p, f), function (er) {
              if (er) return cb(er);
              rmFile(files.pop());
            });
          }
        })(files.pop());
      });
    }
  })
}