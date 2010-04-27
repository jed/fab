exports.name      = "fab.collect";
exports.summary   = "Collects apps until fab.collect.end appears, then returns an app that responds with the apps collected."
exports.requires  = [ "fab.body" ];

var fab = { body: require( "./fab.body" ).app };

exports.app = ( function() {
  collect.end = end;
  return collect;
  
  function collect( app ) {
    var apps = [];
    
    return ( function collect( app ) {
      return app == end || fab.end
        ? fab.body( apps )
        : apps.push( app ) && collect;
  
    })( app );
  }
  
  function end(){}
})();