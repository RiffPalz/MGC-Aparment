import { User } from "../../models/index.js";
import { Op } from "sequelize";

const generatePublicUserID = async () => {
  const lastUser = await User.findOne({
    where: { publicUserID: { [Op.like]: "TENANT- %" } },
    order: [["created_at", "DESC"]],
  });

  let nextNumber = 1;

  if (lastUser && lastUser.publicUserID) {
    const match = lastUser.publicUserID.match(/TENANT-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `TENANT-${String(nextNumber).padStart(3, "0")}`;
};

export const createTenant = async (data) => {
  const {
    fullName,
    email,
    contactNumber,
    unitNumber,
    numberOfTenants,
    userName,
    password,
  } = data;

  // Email uniqueness
  const existingEmail = await User.findOne({
    where: { emailAddress: email },
  });
  if (existingEmail) throw new Error("Email already in use");

  // Username uniqueness
  const existingUsername = await User.findOne({
    where: { userName },
  });
  if (existingUsername) throw new Error("Username already in use");

  const publicUserID = await generatePublicUserID();

  const tenant = await User.create({
    publicUserID,
    fullName,
    emailAddress: email,
    contactNumber,
    unitNumber,
    numberOfTenants,
    userName,
    password_hash: password, // hashing handled by model hook
    role: "tenant",
    status: "Approved", //  AUTO APPROVED
  });

  return {
    message: "Tenant created successfully",
    tenantId: tenant.ID,
    publicUserID: tenant.publicUserID,
  };
};