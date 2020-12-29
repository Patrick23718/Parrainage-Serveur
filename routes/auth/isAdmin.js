const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Unauthenticated");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(verified.role);
    if (verified.role == 1 || verified.role == 2) {
      req.user = verified;

      next();
    } else {
      return res.status(401).send("Access denied update permission");
    }
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
