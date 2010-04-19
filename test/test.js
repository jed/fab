var client = require('./http_client')
  , assert = require('assert')
  ,   http = require('http')
  ,    sys = require('sys')
  ,     fs = require('fs')

// find all *_test.js files
var testFiles = []
fs.readdirSync(__dirname).forEach(function(name) {
  if(name.match(/_test/)) testFiles.push(name)
})

var currentFile = null

function runTest() {
  if(testFiles.length == 0) return

  currentFile = testFiles.pop()

  sys.print(currentFile + ": ")

  var test = require("./" + currentFile.replace(/\.js$/, ''))
  , server = http.createServer(test)

  server.listen(0xFAB)

  var resp = test.request(client)

  client.end(server, function() {
    try {
      test.assert(resp)
      sys.puts("passed")
    } catch(e) {
      sys.puts(e.stack)
    }
    runTest()
  })
}

try {
  runTest()
} catch(e) {
  sys.puts(e.stack)
  runTest()
}
