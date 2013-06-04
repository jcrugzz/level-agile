/*
 * client.js :: client piece of the module to connect to the server created
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var multilevel = require('multilevel'),
    level      = require('level'),
    net        = require('net');

var Client = module.exports = function (options) {
  if (!options || !options.port || !options.type) {
    throw new Error('A port is necessary in order to connect to the server');
  }

  this.port = options.port;
  this.db = multilevel.client();

  this.db.pipe(net.connect(this.port)).pipe(this.db);

  return
};
