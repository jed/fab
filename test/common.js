process.mixin(require('sys'));

GLOBAL.fab = require("../");
GLOBAL.http = require("http");
GLOBAL.assert = require("assert");

GLOBAL.checkCallbacks = function(callbacks) {
  for (var name in callbacks) {
    var count = callbacks[name];

    assert.equal(
      0,
      count,
      'Callback '+name+' fire count off by: '+count
    );
  }
};
