var test = require('tape');

var levelAgile = require('../');
var levelServer = require('../lib/server')
var timestamp = require('monotonic-timestamp');
var fromArray = require('read-stream/array');
var data = require('./fixtures/data');

var options = { valueEncoding: 'json' };

test('write and then read from database', function (t) {
  t.plan(5);
  var server = levelServer(options).listen('4444', function () {

    var level = levelAgile({
      host: '127.0.0.1',
      port: 4444
    });

    level.on('error', function (err) {
      t.fail(err);
    });

    var inputStream = fromArray(data);

    var ws = level.writeStream();

    inputStream.pipe(ws);

    ws.on('end', result);

    function result() {
      t.pass('Wrote things');
      var count = 0;
      var rs = level.readStream();
      rs.on('data', function (dat) {
        t.deepEquals(dat, data[count], 'array index ' + count + ' equal' );
        ++count;
        if (count === data.length) {
          t.pass('read all the things');
        }
      });
      rs.on('end', function () {
        level.close();
        server.close();
        t.end();
      });
    };

  });

  server.on('error', function (err) {
    console.error(err);
  });

});
