const express = require("express");
const api = express.Router();
const bcrypt = require("bcrypt");
const {
  authenticateAccessToken,
  authenticateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  sendBackUser,
} = require("./utils");

const { USERS, INFORMATION } = require("../database");
let { REFRESHTOKENS } = require("../database");

api.get("/information", sendBackUser, authenticateAccessToken, (req, res) => {
  const userInformation = INFORMATION.find(
    (user) => user.email === req.user.email
  );
  res.status(200).json([userInformation]);
});

api.get("/users", sendBackUser, authenticateAccessToken, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).send("Invalid Access Token");
  res.status(200).send(USERS);
});

module.exports = api;
