import express from "express";
import { getNearExpiry, getExpired } from "../controllers/expiryController.js";

const router = express.Router();

router.get("/near", getNearExpiry);
router.get("/expired", getExpired);

export default router;