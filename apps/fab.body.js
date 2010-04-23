function body( obj ) {
  return function() {
    var out = this({ body: obj });
    if ( out ) out();
  }
}

exports.summary = "Turns an object into an app that responds with it.";

exports.tests = ( function() {
  var assert = require( "assert" )
    , response = "hello"
    , app = body( response )
    , fn = function(){};

  return [

    function
    bodyReturnsUnaryApp() {
      this( app.length === 0 )
    },
    
    function
    bodyRespondsWithCorrectPayload() {
      var out = this;
      app.call( function( obj ){ out( obj.body === response ) } );
    },
  
    function
    bodyClosesConnection() {
      var out = this;
      app.call( function() {
        return function(){ out( !arguments.length ) }
      })
    }
  ];
  
})();

exports.app = body;