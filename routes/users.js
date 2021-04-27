const express = require("express");
const users = express.Router();
const bcrypt = require("bcrypt");
const {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
} = require("./utils");

const { USERS, INFORMATION, REFRESHTOKENS } = require("../database");
users.post("/register", async (req, res) => {
  const { body } = req;
  if (USERS.find((user) => user.name === body.user))
    return res.status(409).send("user already exists");
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      email: body.email,
      name: body.user,
      password: hashedPassword,
      isAdmin: false,
    };
    USERS.push(user);
    INFORMATION.push({ email: body.email, info: `${body.user}info` });
    res.status(201).send(USERS);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

users.post("/login", authenticateUser, (req, res) => {
  const { user } = req;
  const { email, name, isAdmin } = user;
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  REFRESHTOKENS.push(refreshToken);
  res.status(200).send({ accessToken, refreshToken, email, name, isAdmin });
});

async function authenticateUser(req, res, next) {
  const { body } = req;
  const user = USERS.find((user) => user.email === body.email);
  if (!user) return res.status(404).send("cannot find user");

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
module.exports = users;

/**
 * [
  {
    "email": "hello",
    "name": "inbar",
    "password": "$2b$10$rjes6MU6tmaD.kb1rZQyruCcjHt8qAZ8G77qWA0l0PrpcCpA7TgwO",
    "isAdmin": false
  }
]
 */
