(fab) for the browser: an early alpha
=====================================

well, it's been a long time coming, but i've finally started making progress on the browser version of (fab). *keep in mind that it's just a prototype right now*, without (fab)'s hallmark syntactic sugar. but the core functionality is there. launch `demo.html` in your browser to see what's possible now, or try it [here](http://s3.amazonaws.com/fabdemo/demo.html).

## the (fab) approach to browser apps

the server is a great place to enjoy the kind of functional programming that (fab) is made of, since an html web app is basically a giant function that maps an HTTP request to an HTTP response.

the browser, on the other hand, does not lend itself as well to a functional approach. mutable state is centralized in a giant memory structure called the DOM, with various functions competing to traverse and manipulate it. most frameworks are based on finding things in the DOM and then binding to events that happen to these things.

(fab) takes a different tack. apps are written declaratively in a language just like HTML but still pure javascript, with *every single element and attribute* bound to a stream that constantly updates its latest value. here is what a simple hello world app will look like once the DSL is done:

    ( HTML )
      ( HEAD )
        ( BODY )
          ( DIV, { position: "absolute", style: { left: pointer.offset.x } } )
            ( "Hello, " )( location.hash )
          ()
        ()
      ()
    ()
    
in this example, our app is bound at two places: the `style.top` property is bound to the x coordinate of the mouse, and the substitute for `world` is bound to the url fragment of the window's location. instead of taking a DOM that already exists, waiting for it to load, and then decorating it, (fab) gives you one chance to define your app's behavior by binding everything in the UI to a stream.

## how (fab) streams work

as with (fab) on the server, a stream is just a function that takes a callback, and represents the value of a given variable across time. the difference is that the stream can call this callback not once, but everytime the data that it represents changes. each time this callback is called, the listener can decide whether to return a function and keep listening, so that unbinding is handled automatically.

a stream can represent any value. obvious examples in the browser include the current mouse position, value of the location hash, last clicked/focused/hovered element, and values of form inputs, but a stream can come from anywhere, including the server, to include the user's authentication status and the results of database queries. and these streams can be popped in anywhere, to eventually create apps containging things like this:

    ( DIV )
      ( IF, loggedIn )
        ( DIV )( /* admin panel */ )()
      ( ELSE )
        ( DIV )( /* login panel */ )()
      ()
    ()

where `loggedIn` is just a stream that returns a boolean.

## what about (fab) on the server?

now that a viable client is forming, i'd like to start narrowing the focus of the server version. instead of a general toolkit for async HTTP apps, i'd like to focus on that elusive goal of having one page of javascript logic that can run an HTML on either. ideally, you'd write an app with both server-based and client-based streams. when the server serves the app, it renders what it can in HTML and then sends the javascript version of the app to the client for subsequent logic.

this means that the server (fab) API is going to change again, alas. if you're looking for something more stable on the server, give [expressjs](http://expressjs.com/) a shot.

## now what?

here's what i'll be working on next:

* finish the html DSL and release a proper alpha
* port all javascript operators and `Math` methods to allow stream composition (example: a stream called `distance` that takes two coordinate streams and streams their scalar distance, or a stream called `cookie` that polls document.cookie and streams any changes)
* start unifying the server and browser (fab) APIs

## thanks!

comments or ideas welcome at [@fabjs](http://twitter.com/fabjs)!