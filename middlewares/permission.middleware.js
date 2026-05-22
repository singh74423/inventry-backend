// middlewares/permission.middleware.js

export const checkPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userPermissions = req.user.permissions || [];

      // 🔥 normalize to uppercase (fix case issues)
      const userPerms = userPermissions.map(p => p.toUpperCase());
      const requiredPerms = requiredPermissions.map(p => p.toUpperCase());

     
 const hasAccess =
        userPerms.includes("ALL") ||
        requiredPerms.every(p => userPerms.includes(p));

      if (!hasAccess) {
        return res.status(403).json({
          message: "Permission Denied",
          required: requiredPerms,
          user: userPerms
        });
      }

      next();

    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
};