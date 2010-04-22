var name
  , app
  , fab
    = module.exports
    = require( "./builds/default" ).app;

for ( name in fab ) {
  app = fab[ name ];

  for ( name in app )
    { fab[ name ] = app[ name ] };
}