fab = require( "../" )

with ( fab ) { module.exports = fab

  ( contentLength )
  ( stringify )
  
  ( /\/date/ )
    ( tmpl, "The date is <%= this.toDateString() %>." )
    ()

  ( /\/time/ )
    ( tmpl, "The time is <%= this.toTimeString() %>." )
    ()
  
  ( new Date );
  
}