var assert = require('assert')

var expectedBody = 'unary'

function unary() {
  var app = this({body: expectedBody})
  if(app) app()
}

module.exports = (fab = require( "../" ))
  (fab.nodejs)
  (unary)

module.exports.request = function(client) {
  return client.request('GET', '/')
}

module.exports.assert = function(resp) {
  assert.equal(expectedBody, resp.body)
}