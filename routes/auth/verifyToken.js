const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Unauthenticated");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    //console.log(verified);
    const user = verified;
    next(user);
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
