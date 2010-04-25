var apps = exports.apps = [
  "fab"
  , "fab.body"
  , "fab.Function"
  , "fab.identity"
  , "fab.Number"
  , "fab.path"
  , "fab.RegExp"
  , "fab.status"
];

exports.app = require( "../utils/build" )( apps ).app;