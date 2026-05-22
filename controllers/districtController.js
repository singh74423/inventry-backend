// import District from "../models/District.js";


// // ================= CREATE DISTRICT =================
// export const createDistrict = async (req, res) => {

//   try {

//     const {
//       name,
//       stateId
//     } = req.body;

//     // ✅ ROLE CHECK
//     if (
//       ![
//         "central_admin",
//         "state_admin",
//         "hospital_admin"
//       ].includes(
//         (req.user.role || "")
//           .toLowerCase()
//       )
//     ) {

//       return res.status(403).json({
//         message: "Access Denied"
//       });
//     }

//     // ✅ STATE ADMIN ONLY OWN STATE
//     let finalStateId = stateId;

//     if (
//       (req.user.role || "")
//         .toLowerCase()
//       === "state_admin"
//     ) {

//       finalStateId =
//         req.user.stateId;
//     }

//     // ✅ VALIDATION
//     if (!name || !finalStateId) {

//       return res.status(400).json({
//         message:
//           "Name and State ID required"
//       });
//     }

//     // ✅ CREATE DISTRICT
//     const district =
//       await District.create({

//         name,
//         stateId: finalStateId
//       });

//     // ✅ RESPONSE
//     res.status(201).json({
//       success: true,
//       data: district
//     });

//   } catch (error) {

//     console.log(
//       "CREATE DISTRICT ERROR:",
//       error
//     );

//     // ✅ DUPLICATE
//     if (error.code === 11000) {

//       return res.status(400).json({
//         message:
//           "District already exists"
//       });
//     }

//     res.status(500).json({
//       message: error.message
//     });
//   }
// };


// // ================= GET DISTRICTS =================
// export const getDistricts = async (
//   req,
//   res
// ) => {

//   try {

//     let filter = {};

//     const role =
//       (req.user?.role || "")
//         .toLowerCase();

//     // ✅ STATE ADMIN FILTER
//     if (role === "state_admin") {

//       filter.stateId =
//         req.user.stateId;
//     }

//     // ✅ DISTRICT ADMIN FILTER
//     if (role === "district_admin") {

//       filter._id =
//         req.user.districtId;
//     }

//     // ✅ CENTRAL ADMIN → ALL

//     const districts =
//       await District.find(filter)
//         .populate(
//           "stateId",
//           "name"
//         );

//     res.status(200).json({
//       success: true,
//       count: districts.length,
//       data: districts
//     });

//   } catch (error) {

//     console.log(
//       "GET DISTRICT ERROR:",
//       error
//     );

//     res.status(500).json({
//       message: error.message
//     });
//   }
// };


//-----------------------------------------------------------------------------------------------

import District from "../models/District.js";
import State from "../models/State.js";


// ======================================
// CREATE DISTRICT
// ======================================

export const createDistrict = async (req, res) => {

  try {

    const {
      districtName,
      districtCode,
      stateId
    } = req.body;


    // ✅ ROLE CHECK
    if (
      ![
        "central_admin",
        "state_admin",

      ].includes(
        (req.user?.role || "")
          .toLowerCase()
      )
    ) {

      return res.status(403).json({
        success: false,
        message: "Access Denied"
      });
    }


    // ✅ STATE ADMIN ONLY OWN STATE
    let finalStateId = stateId;

    if (
      (req.user?.role || "")
        .toLowerCase()
      === "state_admin"
    ) {

      finalStateId =
        req.user.stateId;
    }


    // ✅ VALIDATION
    if (
      !districtName ||
      !districtCode ||
      !finalStateId
    ) {

      return res.status(400).json({
        success: false,
        message:
          "District Name, District Code and State ID are required"
      });
    }


    // ✅ CHECK STATE EXISTS
    const state =
      await State.findById(finalStateId);

    if (!state) {

      return res.status(404).json({
        success: false,
        message: "State not found"
      });
    }


    // ✅ CHECK DUPLICATE DISTRICT
    const existingDistrict =
      await District.findOne({
        stateId: finalStateId,
        $or: [
          {
            districtName:
              districtName.trim()
          },
          {
            districtCode:
              districtCode
                .trim()
                .toUpperCase()
          }
        ]
      });

    if (existingDistrict) {

      return res.status(400).json({
        success: false,
        message:
          "District already exists"
      });
    }


    // ✅ CREATE DISTRICT
    const district =
      await District.create({

        districtName:
          districtName.trim(),

        districtCode:
          districtCode
            .trim()
            .toUpperCase(),

        stateId: finalStateId
      });


    // ✅ RESPONSE
    res.status(201).json({
      success: true,
      message:
        "District created successfully",
      data: district
    });

  } catch (error) {

    console.log(
      "CREATE DISTRICT ERROR:",
      error
    );

    // ✅ DUPLICATE KEY ERROR
    if (error.code === 11000) {

      return res.status(400).json({
        success: false,
        message:
          "District already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};




// ======================================
// GET DISTRICTS
// ======================================

export const getDistricts = async (
  req,
  res
) => {

  try {

    let filter = {};

    const role =
      (req.user?.role || "")
        .toLowerCase();


    // ✅ STATE ADMIN FILTER
    if (role === "state_admin") {

      filter.stateId =
        req.user.stateId;
    }


    // ✅ DISTRICT ADMIN FILTER
    if (role === "district_admin") {

      filter._id =
        req.user.districtId;
    }


    // ✅ CENTRAL ADMIN → ALL

    const districts =
      await District.find(filter)
        .populate(
          "stateId",
          "name"
        );


    res.status(200).json({
      success: true,
      count: districts.length,
      data: districts
    });

  } catch (error) {

    console.log(
      "GET DISTRICT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

