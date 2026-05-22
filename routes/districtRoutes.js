// import express from "express";

// import {
//   createDistrict,
//   getDistricts
// } from "../controllers/districtController.js";

// import {
//   protect,
//   authorize
// } from "../middlewares/authMiddleware.js";

// const router = express.Router();

//----------------------------add-----------------


import express from "express";

import {
  createDistrict,
  getDistricts,
} from "../controllers/districtController.js";

const router = express.Router();


// CREATE DISTRICT
router.post("/create", createDistrict);


// GET ALL DISTRICTS
router.get("/all", getDistricts);

export default router;




//-------------------------------------end-----------


// ✅ Create District
// router.post(
//   "/",
//   protect,
//   authorize(
//     ["CREATE_DISTRICT"],
//     [
//          "hospital_admin",
//       "HOSPITAL_ADMIN",
//       "state_admin",
//       "STATE_ADMIN"
//     ]
//   ),
//   createDistrict
// );


// // ✅ Get Districts
// router.get(
//   "/",
//   getDistricts
// );

// export default router;