import cron from "node-cron";
import { Op } from "sequelize";

import Contract from "../models/contract.js";
import Payment from "../models/payment.js";

export const startSystemCron = () => {

  // Runs every day at midnight
  cron.schedule("0 0 * * *", async () => {

    console.log("Running system cron tasks...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = today.getDate();


    /* Contract expiration */
    await Contract.update(
      { status: "Completed" },
      {
        where: {
          end_date: { [Op.lt]: today },
          status: "Active"
        }
      }
    );


    /* Generate monthly rent bill */
    const contracts = await Contract.findAll({
      where: {
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today },
        status: "Active"
      }
    });

    for (const contract of contracts) {

      const billingDay = new Date(contract.start_date).getDate();

      if (billingDay === day) {

        const billingMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          billingDay
        );

        const existing = await Payment.findOne({
          where: {
            contract_id: contract.ID,
            category: "Rent",
            billing_month: billingMonth
          }
        });

        if (!existing) {

          await Payment.create({
            contract_id: contract.ID,
            category: "Rent",
            billing_month: billingMonth,
            amount: contract.rent_amount,
            due_date: billingMonth
          });

          console.log(`Rent bill created for contract ${contract.ID}`);

        }

      }

    }


    /* Mark overdue payments */
    await Payment.update(
      { status: "Overdue" },
      {
        where: {
          due_date: { [Op.lt]: today },
          status: "Unpaid"
        }
      }
    );

    console.log("Cron tasks completed");

  });

};