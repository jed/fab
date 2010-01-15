# (fab) / a javascript DSL for building async web apps

## introduction

(fab) makes it easy to build asynchronous web apps.

here's an example of an application running on [node.js](http://nodejs.org), currently the only supported platform. just create a file:

    // hello.js
    fab = require( "./fab/node" ).fab;
    
    require( "http" ).createServer( 

      ( fab )
        ( "/hello", "hello!" )
      ( fab )
      
    ).listen( 4011 );
    
then run it in node:

    $ node hello.js
    
and hit [http://localhost:4011/](http://localhost:4011/).

## getting started

to get a better understanding of how (fab) works, let's start with the bare minimum. for the sake of brevity, we'll leave out the node.js boilerplate in the above files.

### the (fab) function

here's the smallest possible (fab) app:

    ( fab )( fab )

yep, that's it. this returns a listener: a function that receives HTTP requests and returns HTTP responses. though since we haven't defined any paths, it'll just respond to everything with a 404.

### paths

so now let's add a path:

    ( fab )
      ( "/hello", "hello!" )
    ( fab )
    
this will return `hello world` for any `GET` request on the `/hello` path, and a 404 for anything else. the string `hello world` is just a shortcut, and is automatically turned into a function, so the following is identical:

    ( fab )
      ( "/hello", function(){ return "hello!" } )
    ( fab )
    
let's add another path:

    ( fab )
      ( "/hello", "hello!" )
      ( "/hello/world", "hello world!" )
    ( fab )

now our app responds to both paths.

### nested paths

for paths with a common prefix, like the two above, we can take advantage of (fab)'s hierarchy; like folders in a filesystem, (fab) paths can contain other paths. so this is identical:

    ( fab )
      ( "/hello" )
        [ "GET" ]( "hello!" )
        ( "/world", "hello world!" )
      ()
    ( fab )
    
we've added three new ideas here:

- when a single string (`hello` in this case) is passed as an argument, it returns a new subpath context.
- `[ "GET" ]` can be used to bind to `GET` requests on the current context. all other common http methods (`HEAD`, `GET`, `POST`, `PUT`, `DELETE`, `TRACE`, `OPTIONS`, and `CONNECT`) are also available, as well as the catchall `*`. since `[ "GET" ]` is just a reference to the `GET` method, we could substitute it with the more conventional `.GET`.
- the empty call `()` returns the previous context, which in this case is the root of our app.

### paths with regular expressions

regular expressions can also be used instead of strings, for binding handlers on matching paths:

    ( fab )
      ( "/hello" )
        [ "GET" ]( "hello!" )
        ( /\/(\w+)/", "hello you!" )
      ()
    ( fab )
    
the results of substring matches are available to function handlers too, through the `capture` object on `this` in the handler. this allows us to return dynamic results:

    ( fab )
      ( "/hello" )
        [ "GET" ]( "hello!" )
        ( /\/(\w+)/, function(){ return "hello, " + this.url.capture[ 0 ] + "!" } )
      ()
    ( fab )
    
so that a `GET` request to `/hello/jed` would return `hello, jed!`.

### handling error and other status codes

(fab) also lets us define how we want status codes to be handled, for each level of our app:

    ( fab )
      ( "/hello" )
        [ "GET" ]( "hello!" )
        ( /\/([a-z]+)/", function(){ return "hello, " + this.capture[ 0 ] + "!" } )
        [ 404 ]( "sorry, only lowercase names are supported." )
      ()
      [ 404 ]( "sorry, only /hello paths are valid." )
    ( fab )
    
this allows us to define more meaningful status handlers that are local to each path. when a status is thrown, (fab) will walk up the hierarchy until the first status handler is found, and call that.

### handler functions

since returning static strings isn't very useful, let's talk about function handlers. here's what every handler has available for every request:

- `this.method`: the HTTP method for the request
- `this.headers`: the HTTP headers for the request
- `this.context`: the current node in the hierarchy
- `this.url`: the request url, parsed into components, like `query` and `capture`

we can use this information to return any of the following:

- a number (such as `404`), which will invoke the appropriate status handler
- an object (such as `{ "Location": "http://nodejs.org" }`), which is used to set response headers
- a string (such as `"hello!"`), which gets written as the response body
- an array containing any or all of the above, which lets us return full responses like this:

    ( fab )
      ( "/hello", function() {
        return [
          200,
          { "Content-Length": 6, "Content-Type": "text/plain" },
          "hello!"
        ];
      })
    ( fab )

This sets the status to 200, sets the `Content-Length` header to `6` and the `Content-Type` header to `text/plain`, sends a body with `hello!`, and finishes the response.

keep in mind that order is important: the status and headers must be included before any body content.

### asynchronous and streaming responses

in all the examples above, we've used a static string, or a function that returns the response immediately. but in a truly async app, we can't return the response right away; we might be waiting for some database results, or a remote call. or we might need to wait until the body of a `POST` response is fully sent before responding.

that's no problem for (fab). every function handler is actually passed one argument: a `respond` function. so we can do this:

    ( fab )
      ( "/hello", function( respond ) {
        setTimeout( function() {
          respond( "hello, sorry to make you wait!", null );
        }, 2000 );
      })
    ( fab )

so any arguments passed to this function can be sent as a response whenever the payload is ready, and `null` is used to finish the response. in fact, any value returned in the previous example is converted into a call to the `respond` function, so that this:

    return [ 200, { "Content-Length": 6 }, "hello!" ];
    
is the same as this:

    respond( 200, { "Content-Length": 6 }, "hello!", null );
    
which in turn is the same as this:

    respond( 200 );
    respond( { "Content-Length": 6 } );
    respond( "hello!" );
    respond( null );
    
this allows us to take advantage of the intutive use of `return`, without requiring synchronicity. keep in mind that if the handler function doesn't return anything, the connection will remain open until `respond( null )` is called.

### streaming requests

so far we've returned numbers, objects, and strings to assemble responses, but there's one more thing we can return: a function. this function becomes a listener for subsequent request events: `body` and `complete`.

    ( fab )
      ( "/upload" )
        [ "POST" ]( function( respond ) {
          var buffer = "";
          return function( data ) {
            if ( data !== null ) buffer += data;
            else respond( buffer.length + " characters sent.", null );
          }
        })
      ()
    ( fab )
    
just like the `respond` function, the listener function takes one argument: the data payload. if the payload is `null`, the request is finished and we can return the response.

### middleware

(fab) is easy to extend with your own functions:

    ( fab )
      ( "/hello" )
        ( "/lower" )
          [ "GET" ]( "hello!" )
        ()
        ( "/upper" )
          ( upperCaseBody )
          [ "GET" ]( "hello!" )
        ()
      ()
    ( fab )
    
    function upperCaseBody() {
      var handler = this.handler;
      this.handler = function( respond ) {
        return handler.call( this, function( data ) {
          respond( typeof data === "string" ? data.toUpperCase() : data )
        })
      };
      return this;
    }

any function passed as a single argument to a (fab) function is called with `this` set to the current context, allowing you to wrap the context's handler, or bind to methods received by the context or its subpaths. more documentation on this is forthcoming.

## what's next

here are some things i think would be nice to add for future versions of (fab):

- middleware examples, including basic authentication, header generation for etags, content length, and other basic niceties.
- support for other platforms, most importantly browser environments. this would let you run the same (fab) code on both client and server.

## feedback

feel free to [add an issue](http://github.com/jed/fab/issues) if you find a bug, or fork as you'd like and send me a pull request. you can also find me sometimes in #node.js on freenode, or on [twitter](http://twitter.com/jedschmidt).

## license

Copyright (c) 2009 Jed Schmidt ([http://jedschmidt.com](http://jedschmidt.com))

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.