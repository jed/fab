## welcome to the (fab) v0.5 preview

well, it's been a long time coming, but i'm finally pushing a bare-bones preview branch of (fab) v0.5. there's still more code to come (including ports of the current apps such as `fab.nodejs.fs` and `fab.nodejs.http`), but this will serve to give you an idea of where (fab) is headed, as well as a few examples to get you started.

so what's different? quite a bit. but first:

## run the demo, read the source

once this branch is as stable as the current master, all installation will be done using [npm](http://github.com/isaacs/npm). for now, pull this branch and then fire up the following:

    node server.js
    
you can get a sense of how things work from the comments in the source, but the following gives an overview. you can also check out [my presentation](http://vimeo.com/14093679) at the latest node.js meetup in palo alto, where i talk about (fab) and its:

## top ten priorities

these are the tenets by which (fab) is designed. wherever possible, (fab) should be:

* **terse** (boilerplate should be avoided wherever possible)
* **natural** (javascript only, without pre-compilation or `eval` trickery)
* **consistent** (reuse of not just code but paradigms)
* **clean** (one namespace, no global pollution)
* **unambiguous** (any scoping magic should be explicit in userspace)
* **autonomous** (no global closures or shared state)
* **asynchronous** (nothing should require synchronicity)
* **functional** (side-effects are to be avoided)
* **egalitarian** (no apps should be privileged)
* **composable** (all apps can be embedded as-is in other apps)

probably the biggest change is that:

## streams are the new functions

node.js has changed a lot since (fab) was created, and most of the current development activity is all about *streams*.

(fab) has evolved in the same way; it used to be built on *functions*, but is now built on *streams*.

which makes sense when you think about it when you look at a (fab) app:

    with ( fab )

    ( fab )
      ( listen, 0xFAB )
    
      ( "Hello" )
    
      ( route, /^\/(\w+)$/ )
        ( ", " )( route.capture, 0 )( "!" )
      ()
    ()
    
if you look carefully, you'll realize that the definition of a (fab) app itself is just a list of arguments being _streamed_ to the `fab` function!

    fab( /* args */ )( /* args */ )( /* args */ )( /* args */ ) ...

so instead of a (fab) app reporting its arity (how many other apps it talks to) to some dispatch function, which was admittedly a bit too abstract and magical for most, now it has full access to a stream of incoming app definition data.

this means that every (fab) app is a variation of the following:

    fab.myApp = function( write ) {
      return function read( body ) {
        var done;

        // app logic here

        return done ? read : write;
      }
    }

in other words, every (fab) app is "middleware" (ugh, that word again) that takes an outgoing stream and returns an incoming stream. it runs some logic on each chunk, and when it decides it's done, takes itself out of the loop by kicking control back to its downstream app.

this is a lot simpler than it seems.

for example, here's an app that puts everything within it into a `DIV` html tag.

    function div( write ) {
      // start by writing an open tag.
      write = write( "<div>" );
      
      return function read() {
        // an empty arguments object means its time to end.
        // so write a close tag and revert control downstream.
        if ( !arguments.length ) return write( "</div>");
        
        // otherwise, just pass everything through, and keep going.        
        write = write.apply( undefined, arguments );
        return read;
      }
    }

and we can add it to our app above like this:

    with ( fab )

    ( fab )
      ( listen, 0xFAB )
      
      ( div )
        ( "Hello" )
      
        ( route, /^\/(\w+)$/ )
          ( ", " )( route.capture, 0 )( "!" )
        ()
      ()
    ()

because this app is completely agnostic about all content within it, we can pass anything through, such as a function to be evaluated at runtime, or special tokens that get interpreted by some other (fab) app.

in fact, an html library like this already exists: `fab.html`, which you can see in `server.js`. it's just a namespace in which each member is an app that takes an optional attributes object and a stream of contents, and adds the appropriate open and close tags.

one implication of this design choice is that (fab) doesn't need to bless any particular templating libraries, since a template just takes a stream of input and returns an app that renders an incoming stream. this is part of (fab)'s strategy for:

## decentralization

in the spirit of modularity, the build process has been removed in favor of using isaac's awesome `npm`. so instead of a curation approach in which popular apps work their way into the official distro, (fab) is going to take a more decentralized a la carte approach like that of jQuery plugin ecosystem. so instead of forking/pushing (fab) to get an app in, all you have to do is:

1. make a `fab.`_your-app-name_ directory
2. save your app as `index.js`
3. describe the app name/requirements in `package.json`
4. explain how your app works in `README.md`
5. `npm publish .`

this way, no particular developer (like [this guy](http://github.com/jed)) can be a bottleneck to the progress of the platform. i'm pondering whether to give every single app its own npm install, or group them by functionality, that's just one of my things:

## to do

here's what's next on my plate.

* port all existing apps to the current API
* move all existing apps to npm
* write the (fab) web site in (fab)
* re-launch in time for [jsconf.eu](http://jsconf.eu)

## and as always

i'd love to hear your feedback, either [here](http://github.com/jed/fab/issues) or on [twitter](http://twitter.com/fabjs). thanks!