var name
  , app
  , fab
    = module.exports
    = require( "./builds/all" ).app;

for ( name in fab ) {
  app = fab[ name ];

  for ( name in app )
    { fab[ name ] = app[ name ] };
}

fab.fab = fab;