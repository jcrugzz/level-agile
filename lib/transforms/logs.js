/*
 * logs.js :: logs transform using a simple through stream
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var through = require('through'),
    //
    // to be used temporarily
    //
    timestamp = require('monotonic-timestamp');

//
// ### function Logs ()
// Through stream to transform `instrument` metrics into leveldb keys
var Logs = module.exports = function () {
  return through(function write(data) {
    //
    // TODO: Add group to the key structure
    //
    var pieces = data.meta.key.split('/');
    var key = pieces.join('\x00');

    this.queue({
      key: key + '\x00' + timestamp() + '\x00' + data.host,
      value: data.description,
      keyEncoding: 'utf8',
      valueEncoding: 'utf8'
    });
  });
};
