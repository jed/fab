module.exports = function( exports, imports ) {
  return exports( function( write, fn ) {
    return write( fn );
  })
}