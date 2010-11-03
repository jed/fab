// a stream that returns the contents of the #bg input    
function color( cb ) {
  $( "#bg" ).live( "keydown keyup blur", function fn() {
    return cb && ( cb = cb( this.value ) ) && fn
  })
}

// a stream that returns suggestions based on the #term input
function suggestions( cb ) {
  $( "#term" ).live( "keyup", function fn() {
    $.getJSON(
      "http://suggestqueries.google.com/complete/search?qu=" + this.value + "&json=t&callback=?",
      function( data ){ cb && ( cb = cb( data[ 1 ].join( ", " ) ) ) && fn }
    )
  })
}

function time( cb ) {
  setInterval( function(){ cb = cb( +new Date ) }, 1000 )
  return +new Date
}

// two streams, offset.x and offset.y, that represent the location of the mouse
pointer = {
  offset: ( function( $win, ret ) {
    for ( var dim in ret ) ( function( prop ) {
      ret[ dim ] = function( cb ) {
        $win.bind( "mousemove", function fn( e ) {
          cb ? cb = cb( e[ prop ] ) : $win.unbind( "mousemove", fn )
        })
      }
    })( ret[ dim ] )

    return ret
  })( $( window ), { x: "pageX", y: "pageY" } )
}