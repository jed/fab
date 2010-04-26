exports.name      = "fab.status";
exports.summary   = "Responds with with the given status code.";
exports.requires  = [];

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