const cron = require('cron');
const { Op } = require('sequelize');
const sequelize = require('../util/database');
const Closed_Period=require('../models/closed_period');

// Run every day at midnight
const job = new cron.CronJob('0 0 * * *', async () => {

  
  const t = await sequelize.transaction();
  try {

    let todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // todayMidnight=todayMidnight.toISOString().slice(0, 19).replace("T", " ");

    await Closed_Period.destroy({
      where: {
        end_date: {
          [Op.lt]: todayMidnight  // Deletes records before today (does not delete today's records)
        }
      },
      transaction: t
    });

    await t.commit();

    // console.log("Expired records deleted successfully.");
  } catch (error) {
    await t.rollback();
    console.error("Error deleting expired records:", error);
  }
},
  null, // This function is executed when the job stops
  true, // Start the job right now
  'Asia/Kolkata' // Time zone of this job.
);


module.exports = job;