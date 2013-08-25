/*
 * server.js :: server piece to establish a server instance
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    multilevel = require('multilevel'),
    LiveStream = require('level-live-stream'),
    level = require('level'),
    net = require('net');

var Server = function (options) {
  EventEmitter.call(this);

  options = options || {};
  this.location = options.location || 'level-agile.db';
  this.valueEncoding = options.valueEncoding;

  this.db = level(this.location);

  LiveStream.install(this.db);

  this.server = net.createServer(this._onSocketConnect.bind(this));

};

util.inherits(Server, EventEmitter);

Server.prototype.listen = function (port, callback) {
  this.server.listen(port);
  //
  // Remark: subjective api because.. why not?
  //
  process.nextTick(callback);
  return this;
};

Server.prototype._onSocketConnect = function (c) {
  c.on('error', this.emit.bind(this, 'error'));

  c.pipe(multilevel.server(this.db)).pipe(c);

};

Server.prototype.close = function (callback) {
  this.server.close(callback);
};

module.exports = function (database) {
  return new Server(database);
};
