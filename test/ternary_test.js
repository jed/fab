var assert = require('assert')

function loadBalancer(index) {
  return function( app1 ) {
    return function( app2 ) {
      return function() {
        return [app1, app2][index].call( this );
      }
    }
  }
}

module.exports = (fab = require( "../" ))
  (fab.nodejs)
  (/\/a/)
    (loadBalancer(0))
      ('a')
    ('b')
  (/\/b/)
    (loadBalancer(1))
      ('a')
    ('b')
  (404)

module.exports.request = function(client) {
  return [client.request('GET', '/a'), client.request('GET', '/b')]
}

module.exports.assert = function(resps) {
  assert.equal("a", resps[0].body)
  assert.equal("b", resps[1].body)
}