var dir = require( "path" ).join( __dirname, "../apps")
  , apps = exports.apps = require( "fs" )
      .readdirSync( dir )
      .filter( function( name ){ return name.substr( -3 ) == ".js" } )
      .map( function( name ){ return name.replace( /\.js$/, "" ) } )
      .sort();
      
exports.app = require( "../utils/build" )( apps ).app;