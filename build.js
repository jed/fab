var
  sys = require( "sys" ),
  fs = require( "fs" ),
  path = require( "path" ),

  distsDir = "dist",
  
  requires = [
    "apps/body",
    "apps/method",
    "apps/path",
    "apps/status",

    "apps/Function",
    "apps/Number",
    "apps/RegExp",
    "apps/String",
    "apps/undefined",

    "apps/node-fs",
    "apps/node-http",
    "apps/node-listener",

    "apps/tmpl"
  ];
  
rm( distsDir, function() {
  fs.mkdirSync( distsDir, 0777 );

  var contents = requires.map( function( dir ) {
    return fs.readFileSync( path.join( dir, "index.js" ) )
  });
  
  contents.unshift(
    "exports = module.exports = " +
    require( "./apps/fab" ).fab.toString()
  )
  
  fs.writeFileSync( path.join( distsDir, "fab-node.js" ), contents.join( "\n\n" ) );
});

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