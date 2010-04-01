fab.tmpl
--------

A binary app adapted from John Resig's [micro-templating engine][tmpl]. It converts incoming javascript `body` objects into strings, and passes them back out.

[tmpl]: http://ejohn.org/blog/javascript-micro-templating/
  
**Arity**: 2

**Arguments**: 1

1. The template string.

**Examples**:

    ()
      // /proxytoGoogle?q=fab proxies http://www.google.com/search?q=fab
      ( "/proxytoGoogle" )
        ( fab.http( "http://www.google.com/search" ) )
      ()
    ()
