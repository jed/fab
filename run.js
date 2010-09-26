module.exports = function( exports, imports ) {
  return exports( function run( write, imports ) {
    write = write || function x(){ return x }
  
    return function read( obj ) {
      if ( obj && obj.apply ) {
        var fn = obj;
        
        arguments[ 0 ] = write;

        return run( fn.apply( undefined, arguments ) );
      }
      
      write = write.apply( undefined, arguments );
      return read;
    }
  })
}