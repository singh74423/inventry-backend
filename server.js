import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import stateRoutes from "./routes/stateRoutes.js";
import districtRoutes from "./routes/districtRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import expiryRoutes from "./routes/expiryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import districtTeamRoutes from "./routes/districtTeam.routes.js";

import hospitalTeamRoutes from "./routes/hospitalTeam.routes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());   // ⭐ ye sabse pehle hona chahiye

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/expiry", expiryRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/hospital-team", hospitalTeamRoutes);
app.use("/api/district-team", districtTeamRoutes);

app.get("/", (req, res) => {
  res.send("Hello World ..............");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});