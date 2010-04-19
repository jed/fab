var assert = require('assert')

function respondWithMethod() {
  var out = this;
  return function( head ) {
    var app = out({ body: "method: " + head.method });
    if ( app ) app();
  }
}

module.exports = (fab = require( "../" ))
  (fab.nodejs)
  (respondWithMethod)

module.exports.request = function(client) {
  return client.request('GET', '/')
}

module.exports.assert = function(resp) {
  assert.equal("method: GET", resp.body)
}