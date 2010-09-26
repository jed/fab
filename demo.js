// i'm not a huge fan of the commonJS require spec, but it'll do for now.
module.exports = function( exports, imports ) {

  // imports is an async function that piggybacks on require.
  // if you give it a list of string arguments, your callback will
  // be called with the results in the same order. if you're feeling
  // daring, like we are here, you can omit them and the imports
  // function will toString your callback to find what you're looking
  // for. a cool hack, but a hack nonetheless. "$" is replaced with
  // "/" in module names.
  return imports( function
    ( run
    , node$listen
    , route
    , ignore
    , write
    , stream
    , html
    , head
    , node$fs
    , sleep
    ) {

    // using with for our html module means we can have an awesome DSL for HTML
    // templating. run is an app that recursively evaluates the entire stream once.
    with ( html ) return run

    // this is blank because we don't need to give run a downstream function,
    // since we're not piping anything to stdout.
    ()
    
      // this fires up a listener on port 4011
      ( node$listen, 0xFAB )
      
      // let's route for static files. route is an app that takes two streams,
      // one for matches and one for non-matches.
      ( route, /^\/static/ )
        // we matched!
      
        // the fs module takes one stream: the path name. it's just middleware
        // that converts an upstream path name to the contents of the file.
        ( node$fs )
          // first, get the current directory
          ( __dirname )
          
          // then sleep for 500, just because we can
          ( sleep, 500 )
          
          // then append the pathname
          ( head.url.pathname )
        ()
      ()
      // we didn't match the /static url, so we keep going.
      
      // now let's return the front page
      ( route, /^\/$/ )
        // since we've with'ed the html app above, each uppercase element
        // name <foo> here is a reference to html.<foo>. there's an app
        // for each HTML5 element, and each of these apps is just middleware
        // that outputs an open tag, pipes through its contents, and outputs
        // a close tag when it's done.
        ( HTML )
          ( BODY, { id: "show" } )
            ( "Hello, " )
            
            ( EM )
              // this pattern looks for a url that ends with an alphanumeric string
              ( route, /^\/(\w+)$/ )
                // looks like a path was provided! here, route.capture outputs
                // the captured path segment at the given index.
                ( route.capture, 0 )
              ()
                // we didn't match, so let's output a generic hello. 
                ( "world" )
            ()
            
            ( "!" )
          ()
        ()
      ()
      
      // this is a catchall 404 for any paths that haven't matched.
      ( "Not found.", { status: 404 } )
    ();
  })
}