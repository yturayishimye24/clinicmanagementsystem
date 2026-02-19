import request from "../models/requestModel.js";
import {io} from "../server.js"

export const getRequests = async (req, res) => {
  try {
    const requests = await request.find().sort({ createdAt: -1 }).populate("createdBy","username");
    if (!requests || requests.length === 0) {
      return res.status(200).json({ success: true, requests: [] });
    }

    // Normalize status field for frontend (some components expect `status` lowercase)
    const normalized = requests.map((r) => {
      const obj = r.toObject ? r.toObject() : r;
      obj.status = obj.status || obj.Status || "pending";
      return obj;
    });

    res.status(200).json({ success: true, requests: normalized });
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
      patientCount === null ||
      patientCount === undefined ||
      !reason ||
      !urgency ||
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
      status: Status || "pending",
      createdBy: req.user.id,
    });
    const savedRequest = await createdRequest.save();
    // emit normalized object
    const payload = savedRequest.toObject ? savedRequest.toObject() : savedRequest;
    payload.status = payload.status || payload.Status || "pending";
    io.to("admins").emit("requestCreated", payload);
    res.status(201).json({ success: true, request: payload });
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
      io.to("admins").emit("requestDeleted",id);
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
        status: Status,
        urgency,
      },
      { new: true }
    );
    if (!changedRequest) {
      res.status(501).json({ message: "Failed to change Request" });
    } else {
      const payload = changedRequest.toObject ? changedRequest.toObject() : changedRequest;
      payload.status = payload.status || payload.Status || "pending";
      io.to("admins").emit("requestChanged", payload);
      res.status(200).json({ success: true, message: "Request Updated successfully!", request: payload });
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

    const currentStatus = reqDoc.status || reqDoc.Status;
    if (currentStatus === "approved") {
      return res.status(400).json({ message: "Already approved!" });
    }

    // set both fields for backwards compatibility
    reqDoc.Status = "approved";
    reqDoc.status = "approved";
    await reqDoc.save();

    const payload = reqDoc.toObject ? reqDoc.toObject() : reqDoc;
    payload.status = payload.status || payload.Status || "approved";

    io.to("admins").emit("requestApproved", payload);
    io.to("nurses").emit("requestApproved", payload);
    res.status(200).json({ success: true, message: "Request approved!", request: payload });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Error approving request" });
  }
};

