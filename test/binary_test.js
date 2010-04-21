var assert = require('assert')

var count = 0;
function increment( app ) {
  return function() {
    count++;
    return app.call( this );
  }
}

module.exports = (fab = require( "../" ))
  (fab.nodejs)
  (increment)
  ('test')

module.exports.request = function(client) {
  return client.request('GET', '/')
}

module.exports.assert = function(resp) {
  assert.equal("test", resp.body)
  assert.equal(1, count)
}