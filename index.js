/*
 * index.js :: client piece of the module to connect to the server that is created
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var EventEmitter = require('events').EventEmitter,
    net = require('net'),
    util = require('util'),
    multilevel = require('multilevel');


var transforms = require('./lib/transforms');

var LevelAgile = function (options) {
  if (!options || !options.host || !options.port || !options.transform) {
    throw new Error('Port and host are necessary in order to connect to the server');
  }

  EventEmitter.call(this);

  this.db = multilevel.client();
  this.transform = transforms[options.transform];
  this.connectOpts = {
    host: options.host,
    port: options.port
  };

  this.db.on('error', this.emit.bind(this, 'error'));

  this.connect();
};

util.inherits(LevelAgile, EventEmitter);

LevelAgile.prototype.connect = function () {
  //
  // TODO: Have reconnection logic
  //
  this.client = net.connect(this.connectOpts);

  this.client.on('error', this.emit.bind(this, 'error'));

  this.db.pipe(client).pipe(this.db);

};

LevelAgile.prototype.writeStream = function (options) {
  var ws = this.db.createWriteStream(options);

  ws.on('error', this.emit.bind(this, 'error'));

  return ws;
};

LevelAgile.prototype.readStream = function (options) {
  var rs = this.db.createReadStream(options);

  rs.on('error', this.emit.bind(this, 'error'));

  return rs;
};

module.exports = function(options) {
  return new LevelAgile(options);
};
