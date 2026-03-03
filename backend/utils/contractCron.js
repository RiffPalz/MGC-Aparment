import cron from "node-cron";
import Contract from "../models/contract.js";

export const startContractCron = () => {
  cron.schedule("0 0 * * *", async () => {
    const today = new Date();

    await Contract.update(
      { status: "Completed" },
      {
        where: {
          end_date: {
            [Op.lt]: today,
          },
          status: "Active",
        },
      }
    );

    console.log("Contract auto-expire check completed.");
  });
};

export default startContractCron;