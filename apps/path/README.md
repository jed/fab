fab.path
--------

A ternary app that switches based on path. Requests with a path whose prefix matches the given pattern are passed to the `success` app, or passed to the `failure` app otherwise. If no `failure` app is given, a `404` response is returned.

For successful matches, the matching portion of request path is removed before the request is passed on. For regular expression patterns, any matched groups are pushed onto the `capture` array on the `url` object.

**Arity**: 3

**Arguments**: 1

1. The pattern for matching request paths, as a string or regular expression.

**Examples**:

    ()
      ( "/somepath", "This path starts with '/somepath'." )

      ( "/somepath1" )
        ( "This will never match, because the " +
          "previous app always matches first." )
      ()

      ( /\/exact$/, "This path is an exact match of '/exact'." )
      
      ( "/users/", /(\w+)/, function( back ) {
        // /\/users\/(\w+)/ would have worked too
        return function( head ) {
          back( "Username: " + head.url.capture[ 0 ] )();        
        }
      })
    ()
