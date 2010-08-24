process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

fab = require( "./" );

// define an app that returns a random number
// after 500 milliseconds elapse.
function rand( write, max ) {
  return write( function( write ) {
    return fab.stream( function( stream ) {
      setTimeout( function() {
        var rand = parseInt( Math.random() * max ).toString();
        return stream( write( rand ) )();
      }, 500 );
    });
  });
}

// define a snippet to be placed at the bottom
// of any html page, to jump back to the main page
with ( fab )
with ( html ) returnLink =

( fab )
  ( P, { style: "margin-top:20px;" } )
    ( "return to the " )
    ( A, { href: "/" } )( "front page" )()
  ()
();

// define the main page
with ( fab )
with ( html ) mainPage =

( fab )
  ( H1 )( "welcome to the (fab) v0.5 preview" )()
  
  ( P )( "here are some sample (fab) apps:" )()
  
  ( UL )
    ( LI )( A, { href: "/1" } )( "simple hello world" )()()
    ( LI )( A, { href: "/2" } )( "streamed hello world" )()()
    ( LI )( A, { href: "/3" } )( "anonymous salutation" )()()
    ( LI )( A, { href: "/3/you" } )( "named salutation" )()()
    ( LI )( A, { href: "/4" } )( "delayed async response" )()()
    ( LI )( A, { href: "/5" } )( "delayed async responses" )()()
    ( LI )( A, { href: "/" } )( "this main page" )()()
  ()
  
  ( P )
    ( "i'd love to hear your feedback, on either " )
    ( A, { href: "http://github.com/jed/fab/issues" } )( "github" )()
    ( " or " )
    ( A, { href: "http://twitter.com/fabjs" } )( "twitter" )()
    ( ". thanks! " )
  ()
()

with ( fab )
with ( html )

( fab )
  // listen and let us know
  ( listen, +process.env.PORT || 0xFAB )
  ( log, "listening on port 4011..." )
  
  // return a simple text response
  ( route, /^\/1/ )
    ( undefined, { headers: { "Content-Type": "text/plain" } } )
    ( "this is a simple hello world response." )
  ()

  // return a "streamed" text response
  ( route, /^\/2/ )
    ( undefined, { headers: { "Content-Type": "text/plain" } } )
    ( "this is a" )
    ( " 'streamed' " )
    ( "hello world response." )
  ()
  
  // now try it with some dynamic information
  ( route, /^\/3/ )
    ( undefined, { headers: { "Content-Type": "text/plain" } } )
    ( "hello" )
  
    ( route, /^\/(\w+)$/ )
      ( ", " )( route.capture, 0 )( "!" )
    ()
    
    ( " (now try adding a name to the url, such as /3/name)" )
  ()
  
  // use fab.html templating for the rest of the apps
  ( undefined, { headers: { "Content-Type": "text/html" } } )  

  ( HTML )
    ( HEAD )
      ( TITLE )( "welcome to the (fab) v0.5 preview" )()
      ( STYLE )( "body { font-family:sans-serif }" )()
    ()

    ( BODY )
      // show that responses can be asynchronous
      ( route, /^\/4/ )
        ( P )
          ( "your lucky number is " )
          ( rand, 100 )
          ( ". now try refreshing." )
        ()

        ( returnLink )
      ()

      // show that asynchronous responses are naturally chained
      ( route, /^\/5/ )
        ( P )( "your lucky numbers are:" )()

        ( UL )
          ( LI )( rand, 100 )()
          ( LI )( rand, 100 )()
          ( LI )( rand, 100 )()
          ( LI )( rand, 100 )()
          ( LI )( rand, 100 )()
          ( LI )( rand, 100 )()
        ()

        ( P )
          ( "this page took three seconds to load, to show " )
          ( "that the numbers were streamed in realtime." )
        ()
        
        ( P )
          ( "this is much more compelling when you can see it stream, " )
          ( "so execute the following from the terminal:" )
        ()

        ( PRE )
          ( "curl -N http:" )
          ( function( write ) {
            return write( function( write, head ) {
              return write( head.url.href );
            }) 
          })
        ()
        
        ( P )
          ( "make sure to try this on your machine; for some reason " )
          ( "streaming isn't working on heroku." )
        ()

        ( returnLink )
      ()

      ( method.GET )
        ( mainPage ) // any page can be coded inline, or factored out  
      ()
      
      ( "Method not supported.", { status: 405 } )
    ()
  ()
();
