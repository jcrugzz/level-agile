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
    var dice = data.meta.key.split('/');
    var no = dice.join('\x00');

    this.queue({
      key: no + '\x00' +  data.time + '\x00' + data.host,
      value: data.description,
      keyEncoding: 'utf8',
      valueEncoding: 'utf8'
    });
  });
};
