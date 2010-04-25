exports.summary = "A unary app that responds with the captured url components.";

exports.app = function() {
  var pos = arguments[ 0 ]
    , out = this;
  
  if ( pos == +pos ) return function() {
    var out = this;
    return function( head ) {
      out = out({ body: ( head.url.capture || [] )[ pos ] });
      if ( out ) out();
    }
  }
  
  return function( head ) {
    out = out({ body: head.url.capture || [] });
    if ( out ) out();
  }
}