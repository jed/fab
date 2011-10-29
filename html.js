module.exports = function( exports ) {
  var tags = [

// open
"A ABBR ADDRESS ARTICLE ASIDE AUDIO B BB BDO BLOCKQUOTE BODY BUTTON\
 CANVAS CAPTION CITE CODE COLGROUP DATAGRID DATALIST DD DEL DETAILS\
 DFN DIALOG DIV DL DOCTYPE DT EM EVENTSOURCE FIELDSET FIGURE FOOTER\
 FORM H1 H2 H3 H4 H5 H6 HEAD HEADER HTML I IFRAME INS KBD LABEL\
 LEGEND LI MAP MARK MENU METER NAV NOSCRIPT OBJECT OL OPTGROUP\
 OPTION OUTPUT P PRE PROGRESS Q RP RT RUBY SAMP SCRIPT SECTION\
 SELECT SMALL SPAN STRONG STYLE SUB SUP TABLE TBODY TD TEXTAREA\
 TFOOT TH THEAD TIME TITLE TR UL VAR VIDEO".split( " " ),

// closed
"AREA BASE BR COL COMMAND EMBED HR IMG INPUT KEYGEN LINK META PARAM\
 SOURCE WBR".split( " " )

    ];

  for ( var isVoid = 0, names; names = tags[ isVoid ]; isVoid++ ) {
    for ( var i = 0, name; name = names[ i++ ]; ) {
      elem[ name ] = elem( name.toLowerCase(), !!isVoid );
    }
  }

  elem.DOCTYPE = function( write, dec ) {
    return write( "<!DOCTYPE " )( dec )( ">\n" );
  }

  elem.COMMENT = function( write ) {
    write = write( "<!-- " );

    return function read( obj ) {
      if ( !arguments.length ) return write( " -->" );
      write = write( obj );
      return read;
    }
  }

  return exports( elem );

  function elem( name, isVoid ) {
    return function( write, obj ) {
      write = write( "<" + name );
      write = attrs( write )( obj )( ">" );

      if ( isVoid ) return write;

      return function read( arg ) {
        if ( !arguments.length ) return write( "</" + name + ">" );

        write = write.apply( undefined, arguments );
        return read;
      };
    }
  }

  function attrs( write ) {
    return function read( obj ) {
      for ( var name in obj ) {
        write = write( " " )( name )( "=" );
        write = attr( write )( obj[ name ] );
      }

      return write;
    }
  }

  function attr( write ) {
    return function read( value ) {
      return write( "\"" )( value )( "\"" );
    }
  }
};