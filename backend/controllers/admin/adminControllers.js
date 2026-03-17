import User from "../../models/user.js";
import Contract from "../../models/contract.js";
import Unit from "../../models/unit.js";
import { emitEvent } from "../../utils/emitEvent.js";
import {
  adminLogin,
  verifyAdminOtp,
  resendAdminCode
} from "../../services/admin/adminAuthService.js";

// Login Step 1: Validate credentials and trigger OTP
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminLogin({ email, password });

    return res.status(200).json({
      success: true,
      message: result.message,
      adminId: result.adminId,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

// Login Step 2: Verify OTP and provide access token
export const loginCodeVerify = async (req, res) => {
  try {
    const { adminId, verificationCode } = req.body;
    const result = await verifyAdminOtp({ adminId, verificationCode });

    return res.status(200).json({
      success: true,
      message: result.message,
      accessToken: result.accessToken,
      admin: result.admin,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

// Get the current admin's profile information
export const fetchAdminProfile = async (req, res) => {
  try {
    const { instance: admin, user } = req.admin;

    return res.status(200).json({
      success: true,
      admin: {
        id: admin.ID,
        adminID: admin.adminID,
        fullName: admin.full_name,
        phoneNumber: admin.phoneNumber,
        emailAddress: user.emailAddress,
        userName: user.userName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Fetch admin profile error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch admin profile" });
  }
};

// Update admin details and notify the system of changes
export const saveAdminProfile = async (req, res) => {
  try {
    const { instance: admin, user } = req.admin;
    const { fullName, phoneNumber, emailAddress, userName } = req.body;

    // Update Admin record
    if (fullName) admin.full_name = fullName.trim();
    if (phoneNumber) admin.phoneNumber = phoneNumber.trim();

    // Check for duplicate email before updating User record
    if (emailAddress && emailAddress !== user.emailAddress) {
      const emailExists = await User.findOne({ where: { emailAddress } });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
      user.emailAddress = emailAddress.trim();
    }

    // Check for duplicate username before updating User record
    if (userName && userName !== user.userName) {
      const userNameExists = await User.findOne({ where: { userName } });
      if (userNameExists) {
        return res.status(400).json({ success: false, message: "Username already in use" });
      }
      user.userName = userName.trim();
    }

    await admin.save();
    await user.save();

    // Trigger real-time update event
    emitEvent(req, "dataUpdated", {
      type: "ADMIN",
      action: "UPDATED",
      adminID: admin.adminID,
    });

    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      admin: {
        id: admin.ID,
        adminID: admin.adminID,
        fullName: admin.full_name,
        phoneNumber: admin.phoneNumber,
        emailAddress: user.emailAddress,
        userName: user.userName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin update error:", error);
    return res.status(500).json({ success: false, message: "Failed to update admin profile" });
  }
};

// Request a new verification code
export const resendCodeController = async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!adminId) {
      return res.status(400).json({ success: false, message: "Admin ID is required" });
    }

    await resendAdminCode(adminId);
    return res.status(200).json({ success: true, message: "Verification code resent successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Get a list of tenants waiting for account approval
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "tenant", status: "Pending" },
      attributes: ["ID", "publicUserID", "fullName", "emailAddress", "unitNumber", "status", "created_at"],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch pending users" });
  }
};

// Approve or decline a tenant's account registration
export const updateUserApproval = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findByPk(userId);
    if (!user || user.role !== "tenant") {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    if (!["Approved", "Declined"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({ success: true, message: `Tenant ${status} successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update tenant approval" });
  }
};

// Get detailed list of all approved tenants and their active contracts
export const getTenantsOverview = async (req, res) => {
  try {
    const tenants = await User.findAll({
      where: { role: "tenant", status: "Approved" },
      attributes: ["ID", "userName", "fullName", "emailAddress", "contactNumber", "numberOfTenants"],
      include: [
        {
          model: Contract,
          as: "contracts",
          where: { status: "Active" },
          required: false,
          attributes: ["ID", "start_date", "end_date", "status"],
          include: [{ model: Unit, as: "unit", attributes: ["unit_number", "floor"] }]
        }
      ],
      order: [["fullName", "ASC"]],
    });

    return res.status(200).json({ success: true, count: tenants.length, tenants });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch tenants overview" });
  }
};