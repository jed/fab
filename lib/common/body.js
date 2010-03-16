function( obj ) {
  return function( back ) {
    back = back({ body: obj });
    if ( back ) back = back();
  }
}