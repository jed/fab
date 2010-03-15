( function( decode ) {

  return function() {
    var
      realm = arguments[ 0 ] || "Secure Area",
      _401 = {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic realm=\"" + realm + "\""
        }
      },
  
      fn = arguments[ 1 ] || function(){ return true };
    
    return function() {
      var success = arguments[ 0 ];
  
      return function( respond ) {
        return function( head ) {
          var
            auth = head.headers.authorization,
            authenticated, next;
            
          if ( !auth || auth.substr( 0, 6 ) !== "Basic " ) {
            return respond( _401 )();
          }
          
          authenticated = fn.apply(
            this, decode( auth.substr( 6 ) ).split( ":" )
          );
          
          if ( !authenticated ) {
            return respond({ status: 403 })();
          }
          
          next = success( respond );
          if ( next ) next = next( head );
          
          return next;
        }
      }
    }
  }
})(

  ( function() {

    var
      base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      base64DecodeChars = [];
    
    for ( var i = 128; i--; ) {
      if ( base64DecodeChars[ i ] === undefined )
        base64DecodeChars[ i ] = -1;
    
      base64DecodeChars[ base64EncodeChars.charCodeAt( i ) ] = i;
    }
    
    return base64decode;

    /* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
     * Version: 1.0
     * LastModified: Dec 25 1999
     * This library is free.  You can redistribute it and/or modify it.
     */
    
    function base64decode( str ) {
        var c1, c2, c3, c4;
        var i, len, out;
    
        len = str.length;
        i = 0;
        out = "";
        while(i < len) {
      /* c1 */
      do {
          c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while(i < len && c1 == -1);
      if(c1 == -1)
          break;
    
      /* c2 */
      do {
          c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while(i < len && c2 == -1);
      if(c2 == -1)
          break;
    
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    
      /* c3 */
      do {
          c3 = str.charCodeAt(i++) & 0xff;
          if(c3 == 61)
        return out;
          c3 = base64DecodeChars[c3];
      } while(i < len && c3 == -1);
      if(c3 == -1)
          break;
    
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
    
      /* c4 */
      do {
          c4 = str.charCodeAt(i++) & 0xff;
          if(c4 == 61)
        return out;
          c4 = base64DecodeChars[c4];
      } while(i < len && c4 == -1);
      if(c4 == -1)
          break;
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }  
  })()
)