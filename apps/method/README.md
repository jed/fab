fab.method
----------

A ternary app that filters requests based on their method. Requests whose method matches those given are passed to the `success` app, or passed to the `failure` app otherwise. If no `failure` app is given, a `405` response is returned.

For convenience, this app comes with member shortcuts to the standard HTTP methods (`HEAD`, `GET`, `POST`, `PUT`, `DELETE`, `TRACE`, `OPTIONS`, and `CONNECT`), so that `fab.method.GET` is identical to `fab.method( "GET" )`.

**Arity**: 3

**Arguments**: The methods for filtering. Multiple methods can be specified.

**Examples**:

    ()
      ( fab.method( "GET", "HEAD" ) )
        ( "This is a GET or HEAD request." )
      ()
      ( "This is not a GET or HEAD request." )
    ()
