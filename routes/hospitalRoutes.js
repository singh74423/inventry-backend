// import express from "express";
// import { createHospital, getHospitals } from "../controllers/hospitalController.js";

// const router = express.Router();

// router.post("/", createHospital);
// router.get("/", getHospitals);

// export default router;

//--------------------new-------------------------
import express from "express";

import {
  createHospital,
  getHospitals,
  getHospitalsByDistrict,
  updateHospital,
  deleteHospital,
} from "../controllers/hospitalController.js";

const router = express.Router();


// CREATE HOSPITAL
router.post(
  "/",
  createHospital
);


// GET ALL HOSPITALS
router.get(
  "/",
  getHospitals
);


// GET HOSPITALS DISTRICT WISE
router.get(
  "/district/:districtId",
  getHospitalsByDistrict
);



// UPDATE HOSPITAL
router.put(
  "/hospital/update/:id",
  updateHospital
);


// DELETE HOSPITAL
router.delete(
  "/:id",
  deleteHospital
);

export default router;