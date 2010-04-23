exports.summary = "Turns number into an app that responds with it as the status code.";

function status( code ) {
  code = +code;
  return function() {
    var out = this({ status: code });
    if ( out ) out();
  }
}

exports.tests = ( function() {
  var response = 200
    , app = status( response )
    , fn = function(){};

  return [

    function
    statusReturnsUnaryApp() {
      this( app.length === 0 )
    },
    
    function
    statusRespondsWithCorrectPayload() {
      var out = this;
      app.call( function( obj ){ out( obj.status === response ) } );
    },
  
    function
    statusClosesConnection() {
      var out = this;
      app.call( function() {
        return function(){ out( !arguments.length ) }
      })
    }
  ];
  
})();

exports.app = status;