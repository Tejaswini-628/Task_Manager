const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  try {
    // Remove "Bearer "
    token = token.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.id;
    next();

  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};