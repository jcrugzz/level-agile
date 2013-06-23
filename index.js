/*
 * index.js :: client piece of the module to connect to the server that is created
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var multilevel = require('multilevel'),
    net = require('net');

var transforms = require('./lib/transforms');

var LevelAgile = module.exports = function (options) {
  if (!options || !options.host || !options.port || !options.transform) {
    throw new Error('A port is necessary in order to connect to the server');
  }

  var db = multilevel.client(),
      transform = transforms[options.transform](),
      connectOpts = {
        host: options.host,
        port: options.port
      };

  db.pipe(net.connect(connectOpts)).pipe(db);

  return transform.pipe(db.writeStream());
};
