fab.status
----------

A unary app that responds with an HTTP status code.

Eventually, this will also allow binary apps fired for responses with matching status codes.

**Arity**: 1

**Arguments**:

1. An HTTP status code.

**Examples**:

    ()
      ( "/path1" "This is path 1." )
      ( "/path2" "This is path 2." )
      ( "/path3" "This is path 3." )
      ( 404 )
    ()