exports.summary = "A binary app that just returns the upstream app.";

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