module.exports = (roles) => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !roles.includes(role)) {
      return res.status(403).json({
        meta: {
          status: 403,
          message: "Unauthorized",
        },
        data: null,
      });
    }
    next();
  };
};
