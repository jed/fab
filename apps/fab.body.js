function body( obj ) {
  return function() {
    var out = this({ body: obj });
    if ( out ) out();
  }
}

exports.summary = "Turns an object into an app that responds with it.";

exports.test = function() {
  var assert = require( "assert" )
    , response = "hello"
    , app = body( response )
    , fn = function(){};
  
  assert.equal( app.length, 0, "fab.body app is unary." )
  
  app.call( function( obj ) {
    assert.equal( obj.body, response, "body sends correct payload." )
    return function() {
      assert.equal( arguments.length, 0, "fab.body closes connection after payload." )
    }
  })
}

exports.app = body;