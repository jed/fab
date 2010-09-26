module.exports = function( exports ) {
  return exports( function( write ) {
    var buffer = ""
      , types = { String: true, Buffer: true };
  
    return function read( body, head ) {
      // TODO: add timeout to flush?
    
      if ( head && head.status >= 400 ) {
        write( body, head )();
        return function x(){ return x };
      }
    
      else if ( body && types[ body.constructor.name ] ) buffer += body;
  
      else {
        if ( buffer ) write = write( buffer );
        
        buffer = "";
        write = write.apply( undefined, arguments );
      }
      
      return arguments.length ? read : write;
    }
  });
}