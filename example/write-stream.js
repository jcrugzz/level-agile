var levelAgile = require('../');
var timestamp = require('monotonic-timestamp');

var level = levelAgile({
  host: '127.0.0.1',
  port: 4444,
  transform: 'logs'
});

var ws = level.writeStream();

for (var i=0; i<200; i++) {
  ws.write({
    key: 'logs\x00test\x00' + timestamp(),
    value: 'OH HAI THERE ' + i,
    keyEncoding: 'utf8',
    valueEncoding: 'utf8'
  })
}

level.on('error', function (err) {
  console.log(err);
});
