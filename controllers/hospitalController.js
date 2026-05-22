import Hospital from "../models/Hospital.js";
import District from "../models/District.js";
import Batch from "../models/Batch.js";


// ======================================
// CREATE HOSPITAL INSIDE SELECTED DISTRICT
// ======================================

export const createHospital = async (req, res) => {
  try {

    const {
      hospitalName,
      hospitalCode,
      address,
      districtId,
      phone,
      email,
      totalBeds,
      status,
    } = req.body;


    // STEP 1 → CHECK DISTRICT EXISTS

    const district = await District.findById(districtId);

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }


    // STEP 2 → CHECK DUPLICATE HOSPITAL

    const existingHospital = await Hospital.findOne({
      $or: [
        { hospitalCode },
        { hospitalName }
      ]
    });

    if (existingHospital) {
      return res.status(400).json({
        success: false,
        message: "Hospital already exists",
      });
    }


    // STEP 3 → CREATE HOSPITAL

    const hospital = await Hospital.create({
      hospitalName,
      hospitalCode,
      address,
      phone,
      email,
      totalBeds,
      status,

      districtId: district._id,

      stateId: district.stateId,
    });


    // STEP 4 → RESPONSE

    res.status(201).json({
      success: true,
      message: "Hospital created successfully",
      hospital,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// ======================================
// GET ALL HOSPITALS
// ======================================

export const getHospitals = async (req, res) => {
  try {

    const hospitals = await Hospital.find()
      .populate("districtId", "districtName")
      .populate("stateId", "name");

    const hospitalsWithStock = await Promise.all(

      hospitals.map(async (hospital) => {

        const batches = await Batch.find({
          hospitalId: hospital._id
        });

        let totalStock = 0;
        let nearExpiryCount = 0;

        batches.forEach((batch) => {

          totalStock += batch.availableQty || 0;

          const expiryDate = new Date(batch.expiryDate);
          const today = new Date();

          const diffDays =
            (expiryDate - today) /
            (1000 * 60 * 60 * 24);

          if (diffDays <= 30 && diffDays >= 0) {
            nearExpiryCount++;
          }
        });

        return {
          ...hospital._doc,

          totalStock,

          nearExpiryCount,

          lowStock: totalStock < 100,

          outOfStock: totalStock <= 0
        };
      })
    );

    res.status(200).json({
      success: true,
      count: hospitalsWithStock.length,
      hospitals: hospitalsWithStock,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// ======================================
// GET HOSPITALS DISTRICT WISE
// ======================================

export const getHospitalsByDistrict = async (req, res) => {
  try {

    const { districtId } = req.params;

    const hospitals = await Hospital.find({
      districtId,
    })
      .populate("districtId", "districtName")
      .populate("stateId", "name");

    const hospitalsWithStock = await Promise.all(

      hospitals.map(async (hospital) => {

        const batches = await Batch.find({
          hospitalId: hospital._id
        });

        let totalStock = 0;
        let nearExpiryCount = 0;

        batches.forEach((batch) => {

          totalStock += batch.availableQty || 0;

          const expiryDate = new Date(batch.expiryDate);
          const today = new Date();

          const diffDays =
            (expiryDate - today) /
            (1000 * 60 * 60 * 24);

          if (diffDays <= 30 && diffDays >= 0) {
            nearExpiryCount++;
          }
        });

        return {
          ...hospital._doc,

          totalStock,

          nearExpiryCount,

          lowStock: totalStock < 100,

          outOfStock: totalStock <= 0
        };
      })
    );

    res.status(200).json({
      success: true,
      count: hospitalsWithStock.length,
      hospitals: hospitalsWithStock,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// ======================================
// UPDATE HOSPITAL
// ======================================

export const updateHospital = async (req, res) => {
  try {

    const { id } = req.params;

    const updatedHospital = await Hospital.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedHospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hospital updated successfully",
      hospital: updatedHospital,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// ======================================
// DELETE HOSPITAL
// ======================================

export const deleteHospital = async (req, res) => {
  try {

    const { id } = req.params;

    const deletedHospital = await Hospital.findByIdAndDelete(id);

    if (!deletedHospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hospital deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};