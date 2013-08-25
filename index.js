/*
 * index.js :: client piece of the module to connect to the server that is created
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var EventEmitter = require('events').EventEmitter,
    net = require('net'),
    util = require('util'),
    back = require('back'),
    liveStream = require('level-live-stream'),
    multilevel = require('multilevel');

var LevelAgile = function (options) {
  if (!options || !options.host || !options.port)  {
    throw new Error('Port and host are necessary in order to connect to the server');
  }

  EventEmitter.call(this);

  this.db = multilevel.client();
  this.connectOpts = {
    host: options.host,
    port: options.port
  };
  this.backoff = options.backoff;

  this.db.on('error', this.emit.bind(this, 'error'));

  this.connect();
};

util.inherits(LevelAgile, EventEmitter);

LevelAgile.prototype.connect = function () {

  this.socket = net.connect(this.connectOpts);
  //
  // TODO: Add reconnect logic using back on errors
  //
  this.socket.on('error', this.emit.bind(this, 'error'));

  this.socket.pipe(this.db.createRpcStream()).pipe(this.socket);
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

LevelAgile.prototype.liveStream = function (options) {
  var live = liveStream(options)(this.db);

  live.on('error', this.emit.bind(this, 'error'));

  return live;
};

LevelAgile.prototype.close = function () {
  this.socket.destroy();
  this.emit('close');
};

module.exports = function (options) {
  return new LevelAgile(options);
};
