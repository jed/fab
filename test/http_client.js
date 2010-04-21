var http = require('http')

exports.port = 0xFAB
exports.requests = 0

var sys = require('sys')

exports.request = function(method, path, options) {
  exports.requests += 1

  var testResp = new TestResponse()
      , client = http.createClient(exports.port)
  if(!options) options = {}
  client.request(method, path, options.headers || {})
    .addListener('response', function(resp) {
      resp.setBodyEncoding('utf8')
      testResp.statusCode = resp.statusCode
      resp.addListener('data', function(chunk) { testResp.body += chunk })
      resp.addListener('end',  function()      { endRequest()           })
    })
    .end()
  return testResp
}

exports.end = function(server, callback) {
  exports.server   = server
  exports.callback = callback
  if(exports.requests < 1)
    endRequest()
}

function TestResponse() {
  this.statusCode = null
  this.body       = ""
}

function endRequest() {
  exports.requests -= 1
  if(exports.requests > 0) return
  if(exports.server)
    exports.server.close()
  if(exports.callback) 
    exports.callback()
}