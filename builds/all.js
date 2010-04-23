var dir = require( "path" ).join( __dirname, "../apps")
  , apps = require( "fs" )
      .readdirSync( dir )
      .filter( function( name ){ return name.substr( -3 ) == ".js" } )
      .map( function( name ){ return name.replace( /\.js$/, "" ) } )
      .sort();
      
module.exports = require( "../utils/build" )( apps );