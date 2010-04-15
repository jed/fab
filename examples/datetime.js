fab = require( "../" )

module.exports = fab

  ( fab.contentLength )
  ( fab.stringify )
  
  ( /\/date/ )
    ( fab.tmpl )
      ( "The date is <%= this.toDateString() %>." )
    ()

  ( /\/time/ )
    ( fab.tmpl )
      ( "The time is <%= this.toTimeString() %>." )
    ()
  
  ( new Date );