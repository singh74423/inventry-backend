import Medicine from "../models/Medicine.js";

// create medicine
export const createMedicine = async (req, res) => {
  try {

    const medicine = await Medicine.create(req.body);

    res.status(201).json(medicine);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

// get all medicines
export const getMedicines = async (req, res) => {
  try {

    const medicines = await Medicine.find();

    res.json(medicines);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};