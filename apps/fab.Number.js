var fab = {
  status: require( "./fab.status" ).app,
  body: require( "./fab.body" ).app
}

exports.app = function( code ) {
  var isHttpStatus = code < 506 &&
    code % 100 <= [ 0, 1, 6, 7, 17, 5 ][ code.toString()[0] ];

  return fab[ isHttpStatus ? "status" : "body" ]( code );
}