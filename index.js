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
  if (!options || !options.host || !options.port || !options.transform) {
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

  this.con = net.connect(this.connectOpts);
  //
  // TODO: Add reconnect logic using back on errors
  //
  this.con.on('error', this.emit.bind(this, 'error'));

  this.con.pipe(this.db.createRpcStream()).pipe(this.con);
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

module.exports = function (options) {
  return new LevelAgile(options);
};
