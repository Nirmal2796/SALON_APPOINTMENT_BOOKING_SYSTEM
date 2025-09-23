// appointmentReminderCron.js
const cron = require("cron");
const { Op } = require('sequelize');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const Salon = require('../models/salon');
const Service = require('../models/service');
const Employee = require('../models/employee');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const sentReminders = new Set();
const job = new cron.CronJob('*/10 * * * * *', async () => {

  try {

    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    threeDaysLater.setHours(0, 0, 0, 0);
    const endOfDay = new Date(threeDaysLater);
    endOfDay.setHours(23, 59, 59, 999);


    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = {
      email: 'nirmalgadekar2796@gmail.com',
      name: 'SALON APPOINTMENT'
    }


    const appointments = await Appointment.findAll({
      where: {
        date: {
          [Op.between]: [threeDaysLater, endOfDay],
        },
      },
    });

    // console.log('<<<<<<<<<<<<<<<<<<<<<< IN APPOINTMENT REMINDER JOB >>>>>>>>>>>>>>>>>>');

    const groupedMap = new Map();

    appointments.forEach((appt) => {

      if (sentReminders.has(appt.id)) return;
      
      console.log(`Send reminder to ${appt.name} for ${appt.date}`);
      
      // trigger your notification/email logic here
      if (!groupedMap.has(appt.userId)) {

        groupedMap.set(appt.userId, []);

      }
      groupedMap.get(appt.userId).push(appt);

    });


    // Now sending reminders
    groupedMap.forEach(async (appointmentsArr, userId) => {
      console.log(`User ${userId} appointments:`);

      const user=await User.findByPk(userId);

      
        const receiver = [
        {
          email: user.email
        }
      ]


      // 1. Get all unique IDs from appointments
const salonIds = [...new Set(appointmentsArr.map(a => a.salonId))];
const employeeIds = [...new Set(appointmentsArr.map(a => a.employeeId))];
const serviceIds = [...new Set(appointmentsArr.map(a => a.serviceId))];

// 2. Fetch all required records at once
const salons = await Salon.findAll({ where: { id: salonIds } });
const employees = await Employee.findAll({ where: { id: employeeIds } });
const services = await Service.findAll({ where: { id: serviceIds } });

// 3. Convert to maps for quick lookup
const salonMap = new Map(salons.map(s => [s.id, s]));
const employeeMap = new Map(employees.map(e => [e.id, e]));
const serviceMap = new Map(services.map(sv => [sv.id, sv]));

     // 4. Build table rows
const appointmentRows = appointmentsArr.map(a => `
  <tr>
    <td>${salonMap.get(a.salonId)?.name || 'Unknown'}</td>
    <td>${serviceMap.get(a.serviceId)?.name || 'Unknown'}</td>
    <td>${employeeMap.get(a.employeeId)?.name || 'Unknown'}</td>
    <td>${a.date}</td>
    <td>${a.start_time}</td>
  </tr>
`).join('');


   const htmlContent = `
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>Here are your upcoming appointments:</p>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Salon</th>
          <th>Service</th>
          <th>Employee</th>
          <th>Date</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        ${appointmentRows}
      </tbody>
    </table>
    <p>Thank you,<br>The Salon Booking Team</p>
  `;

      const response = await tranEmailApi.sendTransacEmail({
                  sender,
                  to: receiver,
                  subject: 'Appointment Reminder',
                  htmlContent
              });

      appointmentsArr.forEach(a => sentReminders.add(a.id));
    });



    // console.log("Expired records deleted successfully.");
  } catch (error) {
    console.error("Error", error);
  }
},
  null, // This function is executed when the job stops
  true, // Start the job right now
  'Asia/Kolkata' // Time zone of this job.
);


// const runAppointmentReminderJob = () => {
//   cron.schedule('0 9 * * *', async () => {

//   });
// };

module.exports = job;