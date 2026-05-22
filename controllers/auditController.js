import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req, res) => {
  try {

    const logs = await AuditLog.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "Audit Logs",
      count: logs.length,
      data: logs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};