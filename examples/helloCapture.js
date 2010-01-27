( fab )
  ( "/hello" )
    [ "GET" ]( "hello!" )
    ( /\/(\w+)/, function(){
      return "hello, " + this.url.capture[ 0 ] + "!"
    })
  ()
( fab )