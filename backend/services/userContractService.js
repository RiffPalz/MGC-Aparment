import Contract from "../models/contract.js";
import Unit from "../models/unit.js";
import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";

/** Ensure PDF URL works correctly from Cloudinary */
const getWorkingPdfUrl = (storedUrl) => {
  if (!storedUrl) return null;

  try {
    // Extract public_id from stored URL
    const match = storedUrl.match(/\/(?:image|raw|video)\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return storedUrl;

    const publicId = match[1];

    // Generate correct raw file URL
    return cloudinary.url(publicId, {
      resource_type: "raw",
      secure: true,
    });
  } catch {
    return storedUrl;
  }
};

/** Get contracts for a specific user */
export const getUserContracts = async (userId) => {
  const contracts = await Contract.findAll({
    include: [
      {
        model: User,
        as: "tenants",
        required: true,
        where: { ID: userId },
        attributes: []
      },
      {
        model: Unit,
        as: "unit",
        attributes: ["unit_number", "floor"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return contracts.map((c) => {
    const json = c.toJSON();
    json.contract_file = getWorkingPdfUrl(json.contract_file);
    return json;
  });
};