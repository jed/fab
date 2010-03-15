function( str ) {
  return function( back ) {
    back = back({ body: str });
    if ( back ) back = back();
  }
}