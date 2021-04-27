const express = require("express");
const options = express.Router();
const jwt = require("jsonwebtoken");

const { USERS, ACCESS_TOKEN_SECRET } = require("../database");

options.options("/", (req, res) => {
  res.status(200).header({ Allow: "OPTIONS, GET, POST" });

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.send([option[0], option[1]]);
  }
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, userToken) => {
    if (err) return res.send([option[0], option[1], option[2]]);
    const user = USERS.find((user) => user.email === userToken.email);
    if (!user.isAdmin)
      return res.send([
        option[0],
        option[1],
        option[2],
        option[3],
        option[4],
        option[5],
      ]);
    return res.send(option);
  });
  res.send("hello");
});

module.exports = options;

const option = [
  {
    method: "post",
    path: "/users/register",
    description: "Register, Required: email, name, password",
    example: {
      body: { email: "user@email.com", name: "user", password: "password" },
    },
  },
  {
    method: "post",
    path: "/users/login",
    description: "Login, Required: valid email and password",
    example: { body: { email: "user@email.com", password: "password" } },
  },
  {
    method: "post",
    path: "/users/token",
    description: "Renew access token, Required: valid refresh token",
    example: { headers: { token: "*Refresh Token*" } },
  },
  {
    method: "post",
    path: "/users/tokenValidate",
    description: "Access Token Validation, Required: valid access token",
    example: { headers: { Authorization: "Bearer *Access Token*" } },
  },
  {
    method: "get",
    path: "/api/v1/information",
    description: "Access user's information, Required: valid access token",
    example: { headers: { Authorization: "Bearer *Access Token*" } },
  },
  {
    method: "post",
    path: "/users/logout",
    description: "Logout, Required: access token",
    example: { body: { token: "*Refresh Token*" } },
  },
  {
    method: "get",
    path: "api/v1/users",
    description: "Get users DB, Required: Valid access token of admin user",
    example: { headers: { authorization: "Bearer *Access Token*" } },
  },
];
