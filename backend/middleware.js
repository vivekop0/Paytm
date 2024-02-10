const jwt = require("jsonwebtoken");
const JWT_SECRET = require("./config")

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ msg: "Invalid Token1" });
  }

  const token = authHeader.split(" ")[1];
   console.log("this is token",token)

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded)
    req.userId = decoded.username;
    console.log(req.userId)
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid Token", err: err });
  }
};
module.exports = authMiddleware;
