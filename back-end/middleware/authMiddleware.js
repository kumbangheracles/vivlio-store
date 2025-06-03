const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

exports.checkRole = (roleName) => {
  return (req, res, next) => {
    if (req.user?.role !== roleName) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
