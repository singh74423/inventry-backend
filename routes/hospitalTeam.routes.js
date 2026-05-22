// import express from "express";
// const router = express.Router();

// import {
//   createHospitalTeam,
//   deleteHospitalTeam,
//   getHospitalTeam,
//   getHospitalTeamById,
//   login,
//   resetPassword
// } from "../controllers/hospitalTeam.controller.js";

// import { authMiddleware } from "../middlewares/auth.middleware.js";
// import { checkRole } from "../middlewares/role.middleware.js";


// // 🔐 AUTH ROUTES
// router.post("/login", login);
// router.post("/reset-password", resetPassword);


// // 👤 CREATE USER (ONLY HOSPITAL ADMIN)
// router.post(
//   "/",
//   authMiddleware,
//   checkRole("hospital_admin"),
//   createHospitalTeam
// );


// // 👥 GET ALL USERS
// router.get(
//   "/",
//   authMiddleware,
//   getHospitalTeam
// );


// // 👤 GET USER BY ID
// router.get(
//   "/:id",
//   authMiddleware,
//   getHospitalTeamById
// );


// // 🗑 DELETE USER
// router.delete(
//   "/:id",
//   authMiddleware,
//   checkRole("hospital_admin"),
//   deleteHospitalTeam
// );

// export default router;



import express from "express";

const router = express.Router();

import {
  createHospitalTeam,
  login,
  getHospitalTeam,
  getHospitalAdmins,
  deleteHospitalAdmin,
  deleteHospitalTeam,
  resetPassword,
 
} from "../controllers/hospitalTeam.controller.js";

import { authMiddleware }
from "../middlewares/auth.middleware.js";

import { checkRole }
from "../middlewares/role.middleware.js";

// 🔑 LOGIN
router.post("/login", login);

// ✅ CREATE USER
router.post(
  "/",
  authMiddleware,
  checkRole(
    "HOSPITAL_ADMIN",
    "DISTRICT_ADMIN"
  ),
  createHospitalTeam
);

// ✅ GET ALL
router.get(
  "/",
  authMiddleware,
  getHospitalTeam
);

// ✅ GET HOSPITAL ADMINS
router.get(
  "/hospital-admins",
  authMiddleware,
  getHospitalAdmins
);

// ✅ DELETE HOSPITAL ADMIN
router.delete(
  "/hospital-admin/:id",
  authMiddleware,
  deleteHospitalAdmin
);

// ✅ DELETE TEAM USER
router.delete(
  "/:id",
  authMiddleware,
  deleteHospitalTeam
);

// ✅ RESET PASSWORD
router.post(
 "/reset-password/:token",
  resetPassword
);

export default router;