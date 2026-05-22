import express from "express";
import {
  createDistrictUser,
  getDistrictUsers,
  deleteDistrictUser,
} from "../controllers/districtTeam.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/", authMiddleware, createDistrictUser);
router.get("/", authMiddleware, getDistrictUsers);
router.delete("/:id", authMiddleware, deleteDistrictUser);

export default router;