var assert = require('assert')

function loadBalancer( app1 ) {
  return function( app2 ) {
    return function() {
      return app1.call( this );
    }
  }
}

module.exports = (fab = require( "../" ))
  (fab.nodejs)
  (loadBalancer)
    ('a')
  ('b')

module.exports.request = function(client) {
  return client.request('GET', '/')
}

module.exports.assert = function(resp) {
  assert.equal("a", resp.body)
}