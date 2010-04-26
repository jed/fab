exports.name      = "fab.body";
exports.summary   = "Turns an object into a unary app with the object as its response.";
exports.requires  = [];
exports.app = body;

function body( obj ) {
  return function() {
    var out = this({ body: obj });
    if ( out ) out();
  }
}

exports.tests = ( function() {
  var response = "hello"
    , app = body( response );

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