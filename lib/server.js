/*
 * server.js :: server piece to establish a server instance
 *
 * (C) 2013, Jarrett Cruger
 *
 */

var multilevel = require('multilevel'),
    level = require('level'),
    net = require('net');

var Server = module.exports = function (database) {
  var db = level(database);

  var server = net.createServer(function (c) {
    c.pipe(multilevel.server(db)).pipe(c);
  });

  return server;
};


