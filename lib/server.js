/*
 * server.js :: server piece to establish a server instance
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    multilevel = require('multilevel'),
    level = require('level'),
    net = require('net');

var Server = function (database) {
  EventEmitter.call(this);

  var self = this,
      db = level(database);

  var server = net.createServer(function (c) {
    c.pipe(multilevel.server(db)).pipe(c);
    c.on('error', self.emit.bind(self, 'error'));
  });

  return server;
};

util.inherits(Server, EventEmitter);

module.exports = function (database) {
  return new Server(database);
}
