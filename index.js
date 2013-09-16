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
    copy = require('shallow-copy'),
    multilevel = require('multilevel'),
    manifest = require('./manifest.json');

//
// Expose function
//
module.exports = LevelAgile;

//
// Make it an EventEmitter
//
util.inherits(LevelAgile, EventEmitter);

function LevelAgile(options) {
  if (!(this instanceof LevelAgile)) { return new LevelAgile(options) }
  if (!options || !options.host || !options.port)  {
    throw new Error('Port and host are necessary in order to connect to the server');
  }

  EventEmitter.call(this);

  //
  // TODO: Make this manifest configurable
  //
  this.db = multilevel.client(manifest);
  this.connectOpts = {
    host: options.host,
    port: options.port
  };
  this.reconnect = options.reconnect;

  this.db.on('error', this.emit.bind(this, 'error'));

  this.connect();
};

LevelAgile.prototype.connect = function () {

  this.socket = net.connect(this.connectOpts);

  this.socket.on('error', function (err) {
    return this.reconnect
      ? this.reconnect(err)
      : this.emit('error', err);
  }.bind(this));

  this.socket.on('connect', function () {
    //
    // Reset terminate variable as we are now connected
    //
    this.terminate = false;
    this.emit('connect');
  });

  this.socket.pipe(this.db.createRpcStream()).pipe(this.socket);
};

LevelAgile.prototype.reconnect = function (err) {
  this.attempt = this.attempt || copy(this.reconnect);

  return this.terminate
    ? noop()
    : back(function (fail, backoff) {
      if (fail) {
        this.terminate = true;
        this.attempt = null;
        return this.emit('error', err);
      }
      this.emit('reconnect', backoff);
      return this.connect();
    }.bind(this), this.attempt);
};

LevelAgile.prototype.writeStream = function (options) {
  return this.db.createWriteStream(options);
};

LevelAgile.prototype.readStream = function (options) {
   return this.db.createReadStream(options);
};

LevelAgile.prototype.liveStream = function (options) {
  return this.db.liveStream(options);
};

LevelAgile.prototype.close = function () {
  this.socket.destroy();
  this.emit('close');
};

function noop() {};
