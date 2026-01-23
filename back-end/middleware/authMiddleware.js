const jwt = require("jsonwebtoken");
const Role = require("../models/role");
const { User } = require("../models");
exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const { username, role, id } = decoded.UserInfo;

    const roleData = await Role.findOne({ where: { name: role } });

    if (!roleData) return res.status(403).json({ message: "Invalid Role" });

    const userData = await User.findOne({ where: { username } });
    if (!userData) return res.status(404).json({ message: "Admin not found" });
    console.log("decoded", decoded.UserInfo);
    req.id = userData.id;
    req.user = username;
    req.role = role;
    next();
  });
};

exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
