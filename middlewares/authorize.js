export const authorize = (permissions = []) => {
  return (req, res, next) => {

    const userPermissions = req.user.permissions || []

    const allowed = permissions.some(p =>
      userPermissions.includes(p)
    )

    if (!allowed) {
      return res.status(403).json({ message: "Access Denied" })
    }

    next()
  }
}