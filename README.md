# (fab) / a DSL for building [node.js](http://nodejs.org/) apps

## introduction

(fab) makes it easy to build apps in node.js. just create a file:

    // helloWorld.js
    fab = require( "./fab" ).fab;

    fab( "/", "hello world." ).deploy();
    
then run it in node:

    $ node helloWorld.js
    
and then hit [http://localhost:4011/](http://localhost:4011/).

## finding and binding

just like you would use [jQuery](http://jquery.com) to *find* nodes in the DOM and *bind* event handlers to them, you can use (fab) to *find* parts of your site, and *bind* request handlers to them. so this in jQuery:

    jQuery( node-to-find ).click( handler-to-bind );
    
would look like this in (fab):
    
    fab( path-to-find, request-handler-to-bind );

## chaining
    
like jQuery, (fab) is a chained DSL. this means that instead of saving traversal targets locally, you can chain them together to keep things less verbose. the difference is that (fab) uses one overloaded function instead of a collection of methods, so instead of chaining methods, you're chaining functions.

    ( fab )
      ( "/time", function(){ return "the time is " + (new Date).toTimeString() } )
      ( "/date", function(){ return "the date is " + (new Date).toDateString() } )
    .deploy();

its brevity may look unorthodox, but it's perfectly valid javascript, without the need for pre-compilation or `with` scoping magic.

## nesting

one goal of (fab) is to have the structure of your code reflect the structure of your site.

    ( fab )
      ( "/mysite/" )
        ( function() { return "welcome to my site." } )

        ( "pics/", function() { return "pictures coming soon." } )
        ( "code/", function() { return "some of my code." } )
      ()
    .deploy();

this is where the overloading comes in. instead of passing (fab) a path/handler pair, you can pass it:

- a single path (like `"/mysite"` above), to create and return a child path,
- a single handler (like the first function above), to bind the the current path, or
- nothing, to return the parent path of the current context (like `.end()` in jQuery)

## handling errors

because you can define a site hierarchically, you can also have custom error handlers for each part of your site. so to modify the previous example:

    ( fab )
      ( "/mysite/" )
        ( function() { return "welcome to my site." } )

        ( "pics/" )
          ( function() { return "pictures coming soon." } )
          [ 404 ]( "picture not found" )
        ()

        ( "code/" )
          ( function() { return "some of my code." } )
          [ 404 ]( "code not found" )
        ()
      ()
    .deploy();

so `/mysite/badlink`, `/mysite/pics/badlink`, and `/mysite/code/badlink` can all return more helpful 404 errors.

## getting and setting

in addition to the original `request` and `response` arguments from node.js, each handler is called with a `this` object that makes it easy to get/set information about the current request/response. these functions are like `attr` and `css` from jQuery: one argument to get, and two to set.

### this.location( property, [ value ] )

specify only the property string to return information about the current request. you can use the same properties that you would use from `window.location`: `hash`, `host`, `hostname`, `href`, `pathname`, `port`, `protocol`, and `search`.

    ( fab )
      ( "/", function(){ return this.location( "host" ) })
    .deploy();
    
or, specify a value to change any part of the current location. (fab) will interpret this as a redirect, and issue the appropriate `301` status and `Location` header:

    ( fab )
      ( "/", function(){ return this.location( "port", 4012 ) })
    .deploy();

### this.param( property, [ value ] )

specify only a property to return the corresponding query string parameter, or specify a value to change the query string accordingly and issue a `301` redirect.

### this.capture( position )

in addition to strings, you can also use regular expressions to match paths, and return captures in order from the path:

    ( fab )
      ( /\/hello\/(\w+)/, function(){ return "hello, " + this.capture( 0 ) })
    .deploy();

eventually you'll also be able to set any capture and issue a `301` redirect, as with the `location` and `param` methods.

### this.header( name, [ value ] )

specify just a header name to get the corresponding request header, or specify a value to set the response header.

### this.cookie( name, [ value, [ options ] ] )

specify just a name to get a cookie value from the request, or add a value to set the cookie in the response. you can also send and options object with any or all of the following properties: `domain`, `path`, `expires`, and `secure`.

### this.status( [ value ] )

specify no arguments to return the current status, or a number to set the status and invoke the appropriate handler.

## deploying

once you've built your (fab) site, you can deploy on any part of it to deploy to a server.

    fab = require( "./fab" ).fab;
    http = require( "http" );
    server = http.createServer();
    server.listen( 4012 );
    
    ( fab )
    
      ( "site1" )
        ( "/", "this is running on port 4010" )
        .deploy( 4010 )
      ()
    
      // 4011 is the default for (fab)
      ( "site2" )
        ( "/", "this is running on port 4011" )
        .deploy()
      ()
      
      // you can specify an existing server too
      ( "site3" )
        ( "/", "this is running on port 4012" )
        .deploy( server )
      ();

## extending (fab)

(fab) is easy to extend with your own functions:

    ( fab )
      ( "/mysite/", "welcome to my site." )
      ( "/mysite", addTrailingSlash )
    .deploy();
      
    function addTrailingSlash() {
      var path = this.location( "pathname" );
      this.location( "pathname", path + "/" );
    };

and like jQuery, you can add your own methods to prototype of the fab object at `fab.fn` or to the prototype of the request/response object at `fab.env.fn`.

## what's next

though i'm not sure how much of this will actually come true due to time constraints, there are some things i think would be nice to add for future versions of (fab):

### multiple handlers for each bind, chained asynchronously

right now you can only bind a single function to each part of a site, but eventually i'd like the ability to bind many, and chain them:

    fab( /\/user\/(\w+)/, lookupUser, renderUser ).deploy();
    
    function lookupUser() { ... }
    function renderUser() { ... }

in this case, `lookupUser` might perform an asynchronous lookup from a remote datastore, and return a `process.Promise` object, for which `renderUser` would be its `addCallback` function. i haven't thought it through yet, but would love to have (fab) take advantage of javascript's asynchronous nature.

### ability to deploy logic on the server or the browser

i've tried to keep the node.js-specific logic separated so that it could be replaced with browser-specific logic, to allow (fab) to be deployed in a browser, using `window.location.hash` as the actual url. this could be convienient for deploying a certain part of the site that requires little dynamic data, such as a wizard interface, in a standalone browser-based app.

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