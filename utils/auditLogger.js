import AuditLog from "../models/AuditLog.js";

export const logAudit = async (action, userId, description, entity = null, entityId = null) => {
  try {

    await AuditLog.create({
      action: action,
      user: userId,
      description: description,
      entity: entity,
      entityId: entityId
    });

  } catch (error) {
    console.error("Audit log error:", error.message);
  }
};