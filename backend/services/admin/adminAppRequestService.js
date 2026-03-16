import ApplicationRequest from "../../models/applicationRequest.js";
import { sequelize } from "../../config/database.js";


/* GET ALL APPLICATION REQUESTS */
export const getAllApplicationRequests = async () => {

  const applications = await ApplicationRequest.findAll({
    order: [["created_at", "DESC"]],
  });

  return applications;
};



/* DELETE APPLICATION REQUEST */
export const deleteApplicationRequest = async (applicationId) => {

  const application = await ApplicationRequest.findByPk(applicationId);

  if (!application) {
    throw new Error("Application request not found");
  }

  await application.destroy();

  return {
    message: "Application request deleted successfully"
  };
};



/* GET APPLICATION REQUEST STATS */
export const getApplicationRequestStats = async () => {

  const [stats] = await sequelize.query(`
    SELECT
      COUNT(*) AS totalApplications,

      SUM(
        CASE
          WHEN DATE(created_at) = CURDATE()
          THEN 1 ELSE 0
        END
      ) AS todayApplications,

      SUM(
        CASE
          WHEN MONTH(created_at) = MONTH(CURRENT_DATE())
          AND YEAR(created_at) = YEAR(CURRENT_DATE())
          THEN 1 ELSE 0
        END
      ) AS monthApplications

    FROM application_requests
  `);

  return stats[0];
};