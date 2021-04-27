const express = require("express");
const users = express.Router();
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

users.post("/register", async (req, res) => {
  const { body } = req;
  if (USERS.find((user) => user.email === body.email))
    return res.status(409).send("User already exists");

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = {
      email: body.email,
      name: body.name,
      password: hashedPassword,
      isAdmin: body.isAdmin ? true : false,
    };

    USERS.push(user);
    INFORMATION.push({ email: body.email, info: `${body.name} info` });
    res.status(201).send("Register Success");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// log user in + validate password
users.post("/login", authenticateUserLogin, (req, res) => {
  const { user } = req;
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  REFRESHTOKENS.push(refreshToken);

  const { email, name, isAdmin } = user;
  res.status(200).send({ accessToken, refreshToken, email, name, isAdmin });
});

async function authenticateUserLogin(req, res, next) {
  const { body } = req;
  const user = USERS.find((user) => user.email === body.email);
  if (!user) {
    return res.status(404).send("cannot find user");
  }

  try {
    if (await bcrypt.compare(body.password, user.password)) {
      req.user = user;
      next();
    } else res.status(403).send("User or Password incorrect");
  } catch (error) {
    console.log(err);
    res.sendStatus(500);
  }
}

// validate access token
users.post("/tokenValidate", authenticateAccessToken, (req, res) => {
  res.status(200).send({ valid: true });
});

// renew access token
users.post("/token", sendBackUser, authenticateRefreshToken, (req, res) => {
  res.status(200).send({ accessToken: generateAccessToken(req.user) });
});

users.post("/logout", authenticateRefreshToken, (req, res) => {
  REFRESHTOKENS = REFRESHTOKENS.filter((token) => token !== req.body.token);
  res.status(200).send("User Logged Out Successfully");
});

module.exports = users;
