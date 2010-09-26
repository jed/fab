#!/usr/bin/env node

require( "fab" )(
  require(
    require( "path" ).join( process.cwd(), process.argv[ 2 ] )
  )
)