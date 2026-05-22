export const checkRole = (...roles) => {
  return (req, res, next) => {
    console.log("USER:", req.user);

    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const userRole = req.user.role.toLowerCase();

    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access Denied ❌" });
    }

    next();
  };
};