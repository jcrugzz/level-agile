/*
 * index.js :: client piece of the module to connect to the server that is created
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var multilevel = require('multilevel'),
    EventEmitter = require('events').EventEmitter,
    net = require('net');

var transforms = require('./lib/transforms');

var LevelAgile = module.exports = function (options) {
  if(!(this instanceof LevelAgile)) { return new LevelAgile(options) }

  if (!options || !options.host || !options.port || !options.transform) {
    throw new Error('A port is necessary in order to connect to the server');
  }
  EventEmitter.call(this);

  this.db = multilevel.client();
  this.transform = transforms[options.transform]();
  this.connectOpts = {
    host: options.host,
    port: options.port
  };

  this.connect();
};


LevelAgile.prototype.connect = function () {
  //
  // TODO: Have reconnection logic
  //
  this.db.pipe(net.connect(this.connectOpts)).pipe(this.db);

};

LevelAgile.prototype.writeStream = function () {
  return this.transform.pipe(this.db.writeStream());
};
