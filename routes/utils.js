const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET='5';
const REFRESH_TOKEN_SECRET='5';



function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "10s" });
}
function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_TOKEN_SECRET);
}


module.exports = { authenticateToken,generateAccessToken,generateRefreshToken };
