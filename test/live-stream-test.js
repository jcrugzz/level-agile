var test = require('tape');

var levelAgile = require('../');
var levelServer = require('../lib/server');
var fromArray = require('read-stream/array');
var data = require('./fixtures/data');

var options = {};

test('live stream the data as it is written to the database', function (t) {
  t.plan(7);

  var server = levelServer(options).listen(4454, function () {

    var level = levelAgile({
      host: '127.0.0.1',
      port: 4454
    });

    level.on('error', function (err) {
      t.fail(err);
    });

    function cleanup() {
      level.close();
      server.close();
      t.end();
    }

    //
    // Setup the live-stream first and we only need to test new inserts for
    // this
    //
    var live = level.liveStream({ old: false });
    var count = 0;
    live.on('data', function (dat) {
      t.equals(dat.key, data[count].key, 'are keys equal for index ' + count + '?');
      t.equals(dat.value, data[count].value, 'are values equal for index ' + count + '?');
      if (++count === data.length) {
        t.pass('read all the things');
        cleanup();
      }
    });

    var inputStream = fromArray(data);

    var ws = level.writeStream();
    inputStream.pipe(ws);

  });
});

