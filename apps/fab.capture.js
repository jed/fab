var fab = { map: require( "./fab.map" ).app };

exports.summary = "A unary app that responds with the captured url components.";

exports.app = fab.map
  ( function( obj )
    { return { body: obj.url ? obj.url.capture : [] } }
  )
  ( fab.echo );