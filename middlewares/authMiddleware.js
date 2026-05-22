import jwt from "jsonwebtoken";

import User from "../models/User.js";
import HospitalTeam from "../models/hospitalTeam.model.js";
import DistrictUser from "../models/districtUser.model.js";

// ======================================================
// 🔥 PROTECT MIDDLEWARE
// ======================================================

export const protect = async (
  req,
  res,
  next
) => {
  try {
    let token;

    const authHeader =
      req.headers.authorization;

    // 🔥 CHECK TOKEN
    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token =
        authHeader.split(" ")[1];
    }

    // 🔥 NO TOKEN
    if (!token) {
      return res.status(401).json({
        message:
          "Access denied. No token provided"
      });
    }

    // 🔥 VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "DECODED TOKEN:",
      decoded
    );

    // 🔥 FIND USER
    let user =
      await User.findById(
        decoded.id
      );

    // 🔥 CHECK HOSPITAL TEAM
    if (!user) {
      user =
        await HospitalTeam.findById(
          decoded.id
        );
    }

    // 🔥 CHECK DISTRICT USER
    if (!user) {
      user =
        await DistrictUser.findById(
          decoded.id
        );
    }

    // 🔥 USER NOT FOUND
    if (!user) {
      return res.status(401).json({
        message:
          "User not found"
      });
    }

    // 🔥 USER DISABLED
    if (user.status === false) {
      return res.status(403).json({
        message:
          "User account disabled"
      });
    }

    console.log(
      "USER FROM DB:",
      user
    );

    console.log(
      "DB hospitalId:",
      user?.hospitalId
    );

    console.log(
      "TOKEN hospitalId:",
      decoded?.hospitalId
    );

    // 🔥 FINAL USER OBJECT
    req.user = {
      ...user.toObject(),

      hospitalId:
        user.hospitalId ||
        decoded.hospitalId,

      districtId:
        user.districtId ||
        decoded.districtId,

      stateId:
        user.stateId ||
        decoded.stateId,

      role:
        user.role ||
        decoded.role,

      permissions:
        decoded.permissions ||
        []
    };

    console.log(
      "FINAL req.user:",
      req.user
    );

    next();

  } catch (error) {

    console.log(
      "JWT ERROR:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired token"
    });
  }
};

// ======================================================
// 🔥 AUTHORIZE MIDDLEWARE (RBAC)
// ======================================================

export const authorize = (
  permissions = [],
  roles = []
) => {
  return (
    req,
    res,
    next
  ) => {

    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required"
      });
    }

    const userPermissions =
      req.user.permissions || [];

    const userRole =
      (
        req.user.role || ""
      ).toLowerCase();

    const permsArray =
      Array.isArray(
        permissions
      )
        ? permissions
        : [permissions];

    const rolesArray =
      Array.isArray(
        roles
      )
        ? roles.map(
            role =>
              role.toLowerCase()
          )
        : [roles.toLowerCase()];

    const hasRole =
      rolesArray.length > 0
        ? rolesArray.includes(
            userRole
          )
        : false;

    const hasPermission =
      permsArray.length > 0
        ? permsArray.some(
            permission =>
              userPermissions.includes(
                permission
              )
          )
        : false;

    console.log(
      "USER ROLE:",
      userRole
    );

    console.log(
      "ALLOWED ROLES:",
      rolesArray
    );

    if (
      !hasRole &&
      !hasPermission
    ) {
      return res.status(403).json({
        message:
          "Access denied"
      });
    }

    next();
  };
};