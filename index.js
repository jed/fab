require.paths.unshift( __dirname );
module.exports = fab;

function fab( app ){ app( log, imports ) }

function log( data ) {
  if ( data ) process.stdout.write( data );
  return log;
}

function imports( exports ) {
  var libs = []
    , names = 1 in arguments
      ? libs.slice.call( arguments, 1 )
      : exports.toString()
        .split( /[^\w$]+/, exports.length + !!exports.name + 1 )
        .slice( !!exports.name + 1 );
        
  ( function loop() {
    var name = names.shift();

    if ( !name ) exports.apply( undefined, libs );
    
    else {
      require( name.replace( /\W/g, "/" ) )( function( lib ) {
        libs.push( lib );
        loop();
      }, imports );
    }
  })()
}