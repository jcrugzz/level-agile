/*
 * logs.js :: logs transform using a simple through stream
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var through = require('through');

//
// ### function Logs ()
// Through stream to transform `instrument` metrics into leveldb keys
var Logs = module.exports = function () {
  return through(function write(data) {
    //
    // TODO: Add group to the key structure
    //
    this.queue({
      key: data.meta.key + '\x00' +  data.time + '\x00' + data.host,
      value: data.description
    })
  }, function end() {
    this.queue(null);
  })
};
