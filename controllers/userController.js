import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {

    const { password } = req.body;

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });

    res.status(201).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUsers = async (req, res) => {
  try {

    const users = await User.find()
      .populate("stateId")
      .populate("districtId")
      .populate("hospitalId");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};