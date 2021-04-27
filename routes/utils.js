const jwt = require("jsonwebtoken");

const {
  USERS,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
} = require("../database");
let { REFRESHTOKENS } = require("../database");

function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).send("Access Token Required");

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, userToken) => {
    if (err) return res.status(403).send("Invalid Access Token");
    if (req.sendBackUser) {
      req.user = USERS.find((user) => user.email === userToken.email);
    }
    next();
  });
}

function authenticateRefreshToken(req, res, next) {
  const refreshToken = req.body.token;

  if (refreshToken == null) {
    return res.status(401).send("Refresh Token Required");
  }
  if (!REFRESHTOKENS.includes(refreshToken)) {
    return res.status(403).send("Invalid Refresh Token");
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, userToken) => {
    if (err) return res.status(403).send("Invalid Access Token");
    if (req.sendBackUser) {
      req.user = USERS.find((user) => user.email === userToken.email);
    }
    next();
  });
}

function generateAccessToken({ email, password }) {
  return jwt.sign({ email, password }, ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });
}
function generateRefreshToken({ email, password }) {
  return jwt.sign({ email, password }, REFRESH_TOKEN_SECRET);
}

function sendBackUser(req, res, next) {
  req.sendBackUser = true;
  next();
}

module.exports = {
  authenticateAccessToken,
  authenticateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  sendBackUser,
};
