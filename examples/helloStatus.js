( fab )
  ( "/hello" )
    [ "GET" ]( "hello!" )
    ( /\/([a-z]+)/, function(){
      return "hello, " + this.url.capture[ 0 ] + "!"
    })
    [ 404 ]( "sorry, only lowercase names are supported." )
  ()
  [ 404 ]( "sorry, only /hello paths are valid." )
( fab )