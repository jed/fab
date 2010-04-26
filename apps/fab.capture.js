exports.name      = "fab.capture";
exports.summary   = "Responds with the captured url components.";
exports.requires  = [];

exports.app = function() {
  var out = this;
  
  return function( head ) {
    out = out({ body: head.url.capture || [] });
    if ( out ) out();
  }
}