/*
 * server.js :: server piece to establish a server instance
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var multilevel = require('multilevel'),
    level = require('level'),
    net = require('net');

var db = level('/tmp/logs.db');

var Server = module.exports = function (options) {
  var server = net.createServer(function (c) {
    c.pipe(multilevel.server(db)).pipe(c);
  });

  return server;
};


