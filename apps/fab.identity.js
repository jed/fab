exports.name      = "fab.identity";
exports.summary   = "Returns the apstream app.";
exports.requires  = [];

function identity( app ) {
  return app;
}

exports.tests = ( function() {
  function app(){};

  return [
    function
    identityReturnsUpstreamApp() {
      this( identity( app ) == app );
    }
  ]

})()

exports.app = identity;