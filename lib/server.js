/*
 * server.js :: server piece to establish a server instance
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    path = require('path'),
    multilevel = require('multilevel'),
    LiveStream = require('level-live-stream'),
    level = require('level'),
    sublevel = require('level-sublevel'),
    net = require('net');

module.exports = Server;

util.inherits(Server, EventEmitter);

function Server (options) {
  if (!(this instanceof Server)) { return new Server(options) }
  EventEmitter.call(this);

  options = options || {};
  this.location = options.location || 'level-agile.db';
  this.valueEncoding = options.valueEncoding || 'json';

  this.db = sublevel(level(this.location, { valueEncoding: this.valueEncoding }));

  LiveStream.install(this.db);

  //
  // Creates a manifest file for use with client, kept here for autogeneration
  //
  multilevel.writeManifest(this.db, path.join(__dirname, '..', 'manifest.json'));

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
  this.db.close(function(err) {
    if (err) { return this.emit('error', err) }
    this.server.close(callback);
  }.bind(this));
};

