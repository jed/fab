exports.summary = "Turns number into an app that responds with it as the status code.";

exports.app = function( code ) {
  code = +code;
  return function() {
    var out = this({ status: code });
    if ( out ) out();
  }
}