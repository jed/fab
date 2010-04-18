fab = require( "../" );

module.exports = fab

  ( /\// )

    ( /1/ ) // simple
      ( function() {
        this({ body: "Hello, world!" })();
      })
      
    ( /2/ ) // streaming
      ( function() {
        this
          ({ body: "Hello, " })
          ({ body: "world!" })
          ();
      })
      
    ( /3/ ) // complete, jsgi-style
      ( function() {
        this({
          status: 200,
          headers: { "content-type": "text/plain" },
          body: "Hello, world!"    
        })();
      })

    ( /4/ ) // asynchronous
      ( function() {
        var out = this({ body: "Hello, " });
        
        setTimeout( function() {
          out({ body: "world!" })();
        }, 2000 );
      })
      
    ( /5/ ) // request-specific
      ( function() {
        var out = this;
        
        return function( head ) {
          var body = "Hello, " + head.url.pathname.substr(1) + "!";
          out({ body: body })();
        }
      })
      
    ( /6/ ) // incoming body listener
      ( function() {
        var out = this, length = 0;
        
        return function listener( obj ) {
          if ( !obj ) out({ body: "Hello, " + length + " bytes!" })();

          else if ( obj.body ) {
            length += process._byteLength( obj.body.toString() );
          }

          return listener;
        }
      })
      
    ( /7/ ) // fab-style
      ( fab.tmpl, "Hello, <%= this[ 0 ] %>!" )
  
      ( /^\/(\w+)$/ )
        ( fab.capture )
        ( [ "world" ] )
    
    ( 404 )
  
  ( 404 );