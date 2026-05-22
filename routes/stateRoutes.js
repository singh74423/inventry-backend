import express from "express";
import { createState, getStates } from "../controllers/stateController.js";

const router = express.Router();

router.post("/", createState);
router.get("/", getStates);

export default router;