import request from "../models/requestModel.js";

export const getRequests = async (req, res) => {
  try {
    const requests = await request.find().sort({ createdAt: -1 }).populate("createdBy","name");
    if (!requests || requests.length === 0) {
      res.status(404).json({ success: false, message: "Requests not Found!" });
    } else {
      res.status(200).json({ success: true, requests: requests });
    }
  } catch (error) {
    console.log("Error getting requests", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createRequests = async (req, res) => {
  try {
    const {
      requestType,
      itemName,
      patientCount,
      reason,
      urgency,
      Status,
      quantity,
    } = req.body;
    if (
      !requestType ||
      !itemName ||
      !patientCount ||
      !reason ||
      !urgency ||
      !Status ||
      !quantity
    ) {
      return res
        .status(403)
        .json({ message: "You have to fill all fields.", success: false });
    }
    const createdRequest = await new request({
      requestType,
      itemName,
      patientCount,
      quantity,
      reason,
      urgency,
      Status: Status || "pending",
    });
    const savedRequest = await createdRequest.save();
    io.to("admins").emit("requestCreated",savedRequest);
    res.status(201).json({ success: true, request: savedRequest });
  } catch (error) {
    res
      .status(501)
      .json({ success: false, message: "Server error in creating requests" });
  }
};

export const removeRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await request.findByIdAndDelete(id);
    if (!deletedRequest) {
      res.status(501).json({ success:false, message: "Deleting user throwing error" });
    } else {
      res.status(200).json({ success:true, message: "Request deletion successfull!" });
    }
  } catch (error) {
    console.log("Error getting requests", error.message);
  }
};

export const changeRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestType, itemName, patientCount, reason, Status, urgency } =
      req.body;
    const changedRequest = await request.findByIdAndUpdate(
      id,
      {
        requestType,
        itemName,
        patientCount,
        reason,
        Status,
        urgency,
      },
      { new: true }
    );
    if (!changedRequest) {
      res.status(501).json({ message: "Failed to change Request" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Request Updated successfully!" });
    }
  } catch (error) {
    console.log("Error updating request", error.message);
  }
};

export const approveRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const reqDoc = await request.findById(id);
    if (!reqDoc) {
      return res.status(404).json({ message: "Request not found!" });
    }

    if (reqDoc.Status === "approved") {
      return res.status(400).json({ message: "Already approved!" });
    }

    reqDoc.Status = "approved";
    await reqDoc.save();

    res.status(200).json({ success: true, message: "Request approved!", request: reqDoc });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Error approving request" });
  }
};

