/*
 * client.js :: client piece of the module to connect to the server created
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var multilevel = require('multilevel'),
    net = require('net');

var transforms = require('./transforms');

var Client = module.exports = function (options) {
  if (!options || !options.port || !options.transform) {
    throw new Error('A port is necessary in order to connect to the server');
  }

  this.port = options.port;
  this.db = multilevel.client();
  this.transform = transforms[options.transform]

  this.db.pipe(net.connect(this.port)).pipe(this.db);

  return this.transform.pipe(this.db.writeStream());
};
