import TransferRequest from "../models/TransferRequest.js";
import Transaction from "../models/Transaction.js";
import Inventory from "../models/Inventory.js";
import { logAudit } from "../utils/auditLogger.js";
import Hospital from "../models/Hospital.js";


// ======================================================
// 🔥 1. CREATE TRANSFER REQUEST
// ======================================================

export const createTransferRequest = async (req, res) => {
  try {

    const { medicines } = req.body;

    const currentHospital = await Hospital.findById(
      req.user?.hospitalId
    );

    if (!currentHospital) {
      return res.status(400).json({
        message: "User hospital not found"
      });
    }

    let requests = [];

    for (let item of medicines) {

      const { medicine, quantity } = item;

      // 🔥 DISTRICT SEARCH
let inventory = await Inventory.find({
  medicineId: medicine,
  hospitalId: {
    $ne: currentHospital._id
  },
  quantity: { $gt: 0 }
})
.populate({
  path: "hospitalId",
  model: "Hospital"
})
.sort({ expiryDate: 1 });

console.log("INVENTORY:", inventory);
console.log(inventory);
      // 🔥 REMOVE SELF HOSPITAL
// inventory = inventory.filter(
//   inv =>
//     inv.hospitalId?._id?.toString() !==
//     req.user.hospitalId.toString()
// );

      // 🔥 STATE SEARCH
      if (!inventory.length) {

        const stateHospitals = await Hospital.find({
          stateId: currentHospital.stateId,
          _id: { $ne: req.user.hospitalId }
        });

        const stateHospitalIds = stateHospitals.map(
          h => h._id
        );

        inventory = await Inventory.find({
          hospitalId: { $in: stateHospitalIds },
          medicineId: medicine,
          quantity: { $gte: quantity }
        }).sort({ expiryDate: 1 }); // ✅ FEFO
      }

      // 🔥 GLOBAL SEARCH
      if (!inventory.length) {

        inventory = await Inventory.find({
          medicineId: medicine,
          quantity: { $gte: quantity }
        }).sort({ expiryDate: 1 }); // ✅ FEFO
      }

      // 🔥 NO STOCK
      if (!inventory.length) {
        return res.status(400).json({
          message: "Medicine not available anywhere"
        });
      }

      const totalAvailable = inventory.reduce(
        (sum, inv) =>
          sum + (
            inv.quantity -
            (inv.reservedQuantity || 0)
          ),
        0
      );

      if (totalAvailable < quantity) {
        return res.status(400).json({
          message:
            "Supplier hospital does not have enough stock"
        });
      }

      // 🔥 SELECT FEFO HOSPITAL
const selectedHospital =
  inventory.find(inv => inv.hospitalId)?.
  hospitalId?._id;

console.log(
  "SELECTED HOSPITAL:",
  selectedHospital
);


if (!selectedHospital) {
  return res.status(400).json({
    message: "Supplier hospital not found"
  });
}

console.log(
  "SELECTED HOSPITAL:",
  selectedHospital
);


const selectedInventory =
  inventory.find(
    inv => inv.hospitalId
  );

const request =
  await TransferRequest.create({

    medicine,
    quantity,

    batch:
      selectedInventory?._id,

    fromHospital:
      req.user.hospitalId,

    toHospital:
      selectedHospital,

    stateId:
      currentHospital.stateId,

    districtId:
      currentHospital.districtId,

    requestedBy:
      req.user._id,

    transferType:
      "INTRA_DISTRICT",

    status:
      "PENDING"
});
      // 🔥 AUDIT LOG
      await logAudit(
        "TRANSFER_CREATED",
        req.user._id,
        "Transfer request created",
        "TransferRequest",
        request._id
      );

      requests.push(request);
    }

    res.status(201).json({
      message: "Transfer requests created successfully",
      data: requests
    });

  } catch (error) {

    console.error("CREATE REQUEST ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================================
// 🔥 2. HOSPITAL APPROVE
// ======================================================

export const hospitalApprove = async (req, res) => {
  try {

    const request =
      await TransferRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    request.hospitalApproved = true;
    request.approvedByHospital =
      req.user._id;

    // 🔥 FEFO STOCK RESERVE
    const inventory =
      await Inventory.findOne({

hospitalId: request.toHospital,
        medicineId: request.medicine

      }).sort({ expiryDate: 1 }); // ✅ FEFO

    if (!inventory) {
      return res.status(400).json({
        message: "Stock not found"
      });
    }

    const available =
      inventory.quantity -
      inventory.reservedQuantity;

    if (available < request.quantity) {
      return res.status(400).json({
        message:
          "Not enough stock available"
      });
    }

    // 🔥 RESERVE STOCK
    inventory.reservedQuantity +=
      request.quantity;

    await inventory.save();

    request.status =
      "HOSPITAL_APPROVED";

    await request.save();

    // 🔥 AUDIT
    await logAudit(
      "HOSPITAL_APPROVED",
      req.user._id,
      "Hospital approved transfer",
      "TransferRequest",
      request._id
    );

    res.json({
      message:
        "Approved by hospital"
    });

  } catch (error) {

    console.error(
      "HOSPITAL APPROVE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================================
// 🔥 3. HOSPITAL REJECT
// ======================================================

export const hospitalReject = async (req, res) => {
  try {

    const request =
      await TransferRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    let items = [];

    if (
      request.medicines &&
      request.medicines.length > 0
    ) {

      items = request.medicines;

    } else {

      items = [{
        medicine: request.medicine,
        quantity: request.quantity
      }];
    }

    // 🔥 RELEASE RESERVED STOCK
    for (let item of items) {

      const inventory =
        await Inventory.findOne({

  hospitalId: request.toHospital,
          medicineId: request.medicine

        }).sort({ expiryDate: 1 }); // ✅ FEFO

      if (inventory) {

        inventory.reservedQuantity -=
          item.quantity;

        // 🔥 SAFETY
        if (
          inventory.reservedQuantity < 0
        ) {
          inventory.reservedQuantity = 0;
        }

        await inventory.save();
      }
    }

    request.status = "REJECTED";
    request.rejectedBy =
      req.user._id;

    await request.save();
 
    // 🔥 AUDIT
    await logAudit(
      "TRANSFER_REJECTED",
      req.user._id,
      "Transfer rejected",
      "TransferRequest",
      request._id
    );

    res.json({
      message:
        "Rejected successfully"
    });

  } catch (error) {

    console.error(
      "REJECT ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================================
// 🔥 4. DISTRICT APPROVE
// ======================================================

export const districtApprove = async (req, res) => {
  try {

    const request =
      await TransferRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    request.districtApproved = true;

    request.approvedByDistrict =
      req.user._id;

    request.status =
      "DISTRICT_APPROVED";

    await request.save();

    // 🔥 AUDIT
    await logAudit(
      "DISTRICT_APPROVED",
      req.user._id,
      "District approved transfer",
      "TransferRequest",
      request._id
    );

    res.json({
      message:
        "Approved by district"
    });

  } catch (error) {

    console.error(
      "DISTRICT APPROVE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


export const districtReview = async (req, res) => {
  try {

    const request =
      await TransferRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    request.reviewedByDistrict =
      req.user._id;

    request.status =
      "UNDER_REVIEW";

    await request.save();

    await logAudit(
      "DISTRICT_REVIEWED",
      req.user._id,
      "District reviewed transfer",
      "TransferRequest",
      request._id
    );

    res.json({
      message:
        "Reviewed by district",
      data: request
    });

  } catch (error) {

    console.error(
      "DISTRICT REVIEW ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};

// ======================================================
// 🔥 5. DISPATCH TRANSFER
// ======================================================

export const dispatchTransfer = async (req, res) => {
  try {

    const request =
      await TransferRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    // 🔥 VALIDATION
    if (
      !request.hospitalApproved ||
      !request.districtApproved
    ) {

      return res.status(400).json({
        message:
          "Hospital/District approval pending"
      });
    }

    let items = [];

    if (
      request.medicines &&
      request.medicines.length > 0
    ) {

      items = request.medicines;

    } else {

      items = [{
        medicine: request.medicine,
        quantity: request.quantity
      }];
    }

    // 🔥 DISPATCH LOOP
    for (let item of items) {

      if (!item.medicine) continue;

      const inventory =
        await Inventory.findOne({

hospitalId: request.toHospital,
          medicineId: item.medicine

        }).sort({ expiryDate: 1 }); // ✅ FEFO

      if (!inventory) {
        return res.status(400).json({
          message: "Stock not found"
        });
      }

      if (
        inventory.reservedQuantity <
        item.quantity
      ) {

        return res.status(400).json({
          message:
            "Not enough reserved stock"
        });
      }

      // 🔥 UPDATE INVENTORY
      inventory.quantity -=
        item.quantity;

      inventory.reservedQuantity -=
        item.quantity;

      await inventory.save();

      // 🔥 TRANSACTION
   await Transaction.create({

type:
  "TRANSFER_DISPATCH",

hospitalId:
  request.toHospital,

  medicineId:
    item.medicine,

  quantity:
    item.quantity,

fromHospitalId:
  request.toHospital,

toHospitalId:
  request.fromHospital,

  relatedRequestId:
    request._id
});
    }

    request.status = "DISPATCHED";

    request.dispatchDate =
      new Date();

    await request.save();

    // 🔥 AUDIT
    await logAudit(
      "TRANSFER_DISPATCHED",
      req.user._id,
      "Transfer dispatched",
      "TransferRequest",
      request._id
    );

    return res.json({
      message:
        "Stock dispatched successfully",
      data: request
    });

  } catch (error) {

    console.error(
      "DISPATCH ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================================
// 🔥 6. RECEIVE TRANSFER
// ======================================================

export const receiveTransfer = async (req, res) => {
  try {

    const request =
      await TransferRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    if (
      request.status !==
      "DISPATCHED"
    ) {

      return res.status(400).json({
        message:
          "Not dispatched yet"
      });
    }

    let items = [];

    if (
      request.medicines &&
      request.medicines.length > 0
    ) {

      items = request.medicines;

    } else {

      items = [{
        medicine: request.medicine,
        quantity: request.quantity
      }];
    }

    // 🔥 RECEIVE LOOP
    for (let item of items) {

      if (!item.medicine) continue;

      // 🔥 SUPPLIER STOCK
    const supplierStock =
  await Inventory.findOne({

hospitalId:
  request.toHospital,

    medicineId:
      item.medicine
});

      // 🔥 RECEIVER STOCK
let inventory =
  await Inventory.findOne({
hospitalId:
  request.fromHospital,

    medicineId:
      item.medicine,

    batchNumber:
      supplierStock?.batchNumber,

    expiryDate:
      supplierStock?.expiryDate
});
      if (inventory) {

        inventory.quantity +=
          item.quantity;

      } else {

inventory =
  new Inventory({

    hospitalId:
      request.fromHospital,

    medicineId:
      item.medicine,

    batchNumber:
      supplierStock?.batchNumber,

    expiryDate:
      supplierStock?.expiryDate,

    quantity:
      item.quantity
});
      }

      await inventory.save();

      // 🔥 TRANSACTION
await Transaction.create({

  type: "TRANSFER_RECEIPT",

  hospitalId:
    request.fromHospital,

  medicineId:
    item.medicine,

  quantity:
    item.quantity,

  fromHospitalId:
    request.toHospital,

  toHospitalId:
    request.fromHospital,

  relatedRequestId:
    request._id
});
    }

request.receivedDate =
  new Date();

request.completedAt =
  new Date();

request.status =
  "COMPLETED";

    await request.save();

    // 🔥 AUDIT
    await logAudit(
      "TRANSFER_RECEIVED",
      req.user._id,
      "Stock received",
      "TransferRequest",
      request._id
    );

    res.json({
      message:
        "Stock received successfully",
      data: request
    });

  } catch (error) {

    console.error(
      "RECEIVE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================================
export const getTransferRequests =
  async (req, res) => {

    try {

      const hospitalIds = [req.user.hospitalId];

      const requests =
  await TransferRequest.find({

    $or: [

      // requester side
      {
        fromHospital: {
          $in: hospitalIds
        }
      },

      // supplier side only for approve/dispatch
      {
        toHospital: {
          $in: hospitalIds
        },

        status: {
          $in: [
            "PENDING",
            "HOSPITAL_APPROVED",
            "DISTRICT_APPROVED",
            "DISPATCHED"
          ]
        }
      }
    ]
  })

        .populate(
          "medicine",
          "medicineName name"
        )

.populate({
  path: "batch",
  populate: {
    path: "medicineId",
    model: "Medicine",
    select:
      "medicineName name genericName"
  },
  select:
    "batchNumber medicineId"
})

        .populate(
          "fromHospital",
          "_id hospitalName name"
        )

        .populate(
          "toHospital",
          "_id hospitalName name"
        )

        .populate(
          "requestedBy"
        )

        .populate(
          "approvedByHospital"
        )

        .populate(
          "approvedByDistrict"
        )

        .populate(
          "reviewedByDistrict"
        )

        .sort({
          createdAt: -1
        });

        console.log("FIRST REQUEST:", requests[0]);

      res.json({
        data: requests
      });

    } catch (error) {

      console.error(
        "GET REQUESTS ERROR:",
        error
      );

      res.status(500).json({
        message: error.message
      });
    }
};

// ======================================================
// 🔥 8. GET DISTRICT TRANSFERS
// ======================================================

export const getDistrictTransfers =
  async (req, res) => {

    try {

      const requests =
        await TransferRequest.find({

          status: {
            $in: [
              "HOSPITAL_APPROVED",
              "DISTRICT_APPROVED",
              "DISPATCHED",
              "COMPLETED"
            ]
          }
        })

          .populate(
            "medicine",
            "medicineName name genericName"
          )

          .populate({
            path: "batch",
            populate: {
              path: "medicineId",
              select:
                "medicineName name genericName"
            }
          })

          .populate(
            "fromHospital",
            "hospitalName"
          )

          .populate(
            "toHospital",
            "hospitalName"
          )

          .populate(
            "requestedBy"
          );

      res.json({
        data: requests
      });

    } catch (error) {

      console.error(
        "DISTRICT TRANSFER ERROR:",
        error
      );

      res.status(500).json({
        message: error.message
      });
    }
  };