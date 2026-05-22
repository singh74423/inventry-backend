import jwt from "jsonwebtoken";

// 🔹 Generate Token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

// 🔹 Verify Token
export const verifyTokenUtil = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};