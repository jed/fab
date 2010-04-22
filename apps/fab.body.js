exports.summary = "Turns an object into an app that responds with it.";

exports.app = function( obj ) {
  return function() {
    var out = this({ body: obj });
    if ( out ) out();
  }
}
