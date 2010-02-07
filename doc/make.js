var
  posix = require( "posix" ),
  sys = require( "sys" ),
  path = require( "path" ),
  
  examples = {}
  
getExamples();

function getExamples() {
  posix
    .readdir( "examples" )
    .addCallback( function( files ) {
      var count = files.length;
    
      files.forEach( function( filename ) {
        posix
          .cat( path.join( "examples", filename ) )
          .addCallback( function( content ) {
            examples[ filename ] = content;
            if ( !--count ) renderPage();
          })
      })
    })
}

function renderPage() {
  posix
    .cat( "doc/index.tmpl" )
    .addCallback( function( content ) {
      var html = tmpl( content )( { examples: examples } );
      
      posix
        .open( "doc/index.html", process.O_WRONLY | process.O_TRUNC | process.O_CREAT, 0644 )
        .addCallback( function( fd ) {
          posix
            .write( fd, html, 0, "utf8" )
            .addCallback( function() { posix.close( fd ) } )
        })
    })
}

function tmpl( str ) {
  return new Function('obj',
    'var p=[],print=function(){p.push.apply(p,arguments);};' +
    'with(obj){p.push(\'' +
    str.replace(/[\r\t\n]/g, " ")
       .replace(new RegExp("'(?=[^%]*%>)","g"),"\t")
       .split("'").join("\\'")
       .split("\t").join("'")
       .replace(/<%=(.+?)%>/g, "',$1,'")
       .split('<%').join("');")
       .split('%>').join("p.push('")
       + "');}return p.join('');");
};