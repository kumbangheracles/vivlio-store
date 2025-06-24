const jwt = require("jsonwebtoken");
exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.UserInfo.username;
    req.role = decoded.UserInfo.role;
    next();
  });
};
exports.checkRole = (roleName) => {
  return (req, res, next) => {
    if (req.user?.role !== roleName) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
