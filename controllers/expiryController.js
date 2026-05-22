import Batch from "../models/Batch.js";

// Get Near Expiry Batches (30 days)
export const getNearExpiry = async (req, res) => {
  try {

    const today = new Date();

    const next30 = new Date();
    next30.setDate(today.getDate() + 30);

    const batches = await Batch.find({
      expiryDate: { $lte: next30, $gte: today }
    })
    .populate("medicine")
    .populate("hospitalId");

    res.json({
      message: "Near expiry batches",
      count: batches.length,
      data: batches
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Already Expired Batches
export const getExpired = async (req, res) => {
  try {

    const today = new Date();

    const batches = await Batch.find({
      expiryDate: { $lt: today }
    })
    .populate("medicine")
    .populate("hospitalId");

    res.json({
      message: "Expired batches",
      count: batches.length,
      data: batches
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};