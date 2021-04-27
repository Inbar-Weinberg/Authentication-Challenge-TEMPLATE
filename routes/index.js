const { Router } = require("express");
const users = require("./users");
const api = require("./api");
const options = require("./options");

module.exports = { api, users, options };
