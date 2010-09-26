module.exports = function( exports ) {
  var head = getter( "head" )
    , prop, props = {
        method: "",
        url: "href protocol host auth hostname port pathname search query hash capture",
        headers: "accept acceptCharset acceptEncoding acceptLanguage acceptRanges authorization cacheControl connection cookie contentLength contentType date expect from host ifMatch ifModifiedSince ifNoneMatch ifRange ifUnmodifiedSince maxForwards pragma proxyAuthorization range referer te upgrade userAgent via warning"
      };
  
  for ( prop in props ) {
    var subprops = props[ prop ].split( " " );

    head[ prop ] = getter( "head." + prop );
    for ( var i = 0, subprop; subprop = subprops[ i++ ]; ) {
      head[ prop ][ subprop ] = getter( "head." + prop + "." + subprop );
    }
  }
  
  return exports( head );
  
  function writer( val ) {
    return new Function( "write", "head", "return write(" + val + ")" );
  }

  function getter( name ){ return writer( writer( name ) ) }  
};