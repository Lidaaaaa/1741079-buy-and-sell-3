"use strict";

const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);
const filldb = require(`./filldb`);

const Cli = {
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [filldb.name]: filldb
};

module.exports = {
  Cli
};
