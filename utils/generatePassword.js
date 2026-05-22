// utils/generatePassword.js

import crypto from "crypto";

export const generateTempPassword = () =>
  crypto.randomBytes(4).toString("hex");