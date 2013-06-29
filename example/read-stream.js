var levelAgile = require('../');

var level = levelAgile({
  host: '127.0.0.1',
  port: 4444,
  transform: 'logs'
});

level.readStream()
  .on('data', function (data) {
    console.log(data);
  });

level.on('error', function (err) {
  console.error(err);
});
