import Batch from "../models/Batch.js";
import Inventory from "../models/Inventory.js";
import { logAudit } from "../utils/auditLogger.js";


// ✅ Create Batch
export const createBatch = async (req, res) => {

  try {

    // ✅ Create batch
    const batch = await Batch.create(req.body);

    // ✅ Check inventory
    const existingInventory = await Inventory.findOne({
    hospitalId: req.body.hospitalId,
      medicineId: req.body.medicine,
      batchNumber: req.body.batchNumber
    });

    // ✅ Update existing inventory
    if (existingInventory) {

      existingInventory.quantity += req.body.availableQty;

      existingInventory.expiryDate =
        req.body.expiryDate;

      await existingInventory.save();

    } else {

      // ✅ Create new inventory
      await Inventory.create({
        hospitalId: req.body.hospitalId,
        medicineId: req.body.medicine,
        batchNumber: req.body.batchNumber,
        quantity: req.body.availableQty,
        expiryDate: req.body.expiryDate
      });

    }

    res.status(201).json(batch);

  } catch (error) {

    console.log("CREATE BATCH ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }
};



// ✅ Get All Batches
export const getBatches = async (req, res) => {

  try {

const batches = await Batch.find()

.populate(
  "medicine",
  "name"
)

.populate("medicine", "medicineName");

    res.status(200).json(
      batches
    );

  } catch (error) {

    console.log(
      "GET BATCH ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message
    });

  }
};


// ✅ Delete Batch
export const deleteBatch = async (req, res) => {

  try {

    const batch = await Batch.findById(req.params.id);

    if (!batch) {

      return res.status(404).json({
        message: "Batch not found"
      });

    }

    // ✅ Delete inventory linked to batch
    await Inventory.deleteOne({
      hospitalId: batch.hospitalId,
      medicineId: batch.medicine,
      batchNumber: batch.batchNumber
    });

    // ✅ Delete batch
    await Batch.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Batch deleted successfully"
    });

  } catch (error) {

    console.log("DELETE BATCH ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }
};