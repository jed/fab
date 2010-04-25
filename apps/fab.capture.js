exports.summary = "A unary app that responds with the captured url components.";

exports.app = function() {
  var out = this;
  
  return function( head ) {
    out = out({ body: head.url.capture || [] });
    if ( out ) out();
  }
}