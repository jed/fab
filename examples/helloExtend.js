updateGoodbye =
  ( fab )
    ( "/goodbye", "goodbye, i just replaced the existing handler" )
  ()

( fab )
  ( "/hello", "hello!" )
  ( "/goodbye", "goodbye, i'm going to get replaced!" )
  ( updateGoodbye )
( fab )