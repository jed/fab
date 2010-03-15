function( fn ) {
  var i = fn.length, args = [];

  return i < 2 ? fn :
    function collect() {
      args[ --i ] = arguments[ 0 ];

      return i > 1 ? collect :
        function( arg ) {
          args[ 0 ] = arg;
          return fn.apply( this, args );
        };
    };
}