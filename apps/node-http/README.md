fab.http
--------

A unary app that proxies requests to other servers. The remaining path is appended to the specified url, with the headers and method left intact.

**Arity**: 1

**Arguments**:

1. The base URL for proxying.

**Examples**:

    ()
      // /proxytoGoogle?q=fab proxies http://www.google.com/search?q=fab
      ( "/proxytoGoogle" )
        ( fab.http( "http://www.google.com/search" ) )
      ()
    ()
