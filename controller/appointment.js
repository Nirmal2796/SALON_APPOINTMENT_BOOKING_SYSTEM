const sequelize = require('../util/database');
const Appointment = require('../models/appointment');
const Service = require('../models/service');
const Salon = require('../models/salon');
const Employee = require('../models/employee');
const Specialization = require('../models/specialization');
const User = require('../models/user');
const { generateInvoice } = require('../util/invoiceGenerator');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const fs = require('fs');
const { Op } = require('sequelize');


exports.getAppointments = async (req, res) => {

    try {

        const today = new Date();

        const appointments = await req.user.getAppointments({
            where: {
                date: {
                    [Op.gte]: today
                }
            },
            include: [
                { model: Salon },     
                { model: Service },   
                { model: Employee }   
            ]
        });


        res.status(200).json({ appointments: appointments });
    }
    catch (err) {

        console.log(err);
        res.status(500).json({ success: false });
    }
}

exports.addAppointment = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const salonId = req.body.salonId;

        const appointments = req.body.appointments;

        let booked_appointments = [];


        for (const a of appointments) {

            const formattedDate = new Date(a.date);

            const service = await Service.findByPk(a.serviceId);

            const employee = await Employee.findByPk(a.specialistId);

            const [h, m, s] = a.start_time.split(":").map(Number); //.map(Number) Converts each string in the array to a number. ["14", "30", "45"].map(Number) → [14, 30, 45]

            const dateObj = new Date();
            dateObj.setHours(h, m + parseInt(service.duration), s || 0); // Add duration to minutes and If m + service.duration ≥ 60, JavaScript automatically adjusts the hours.


            booked_appointments.push(await Appointment.create({
                salonId: salonId,
                userId: req.user.id,
                serviceId: service.id, //i have to search the service then attach it here.
                date: formattedDate,
                employeeId: employee.id,
                paymentId: req.body.paymentId,
                start_time: a.start_time,
                end_time: dateObj.toTimeString().split(" ")[0]
            }, { transaction: t }));

        }

        await t.commit();


        //SEND EMAIL WITH INVOICE OF CONFIRMATION OF APPOINTMENT.
        try {
            const invoicePath = await generateInvoice(req.body.paymentId, req.user);
            const user = await User.findByPk(req.user.id, { attributes: ['email'] });
            const salon = await Salon.findByPk(req.body.salonId, { attributes: ['name'] });

            await sendConfirmationEmail(user, salon, invoicePath);

        } catch (err) {
            console.error('Post-processing failed:', err);
            // You could log it or alert admin etc.
        }

        // await sendConfirmationEmail(user,salon,invoicePath);


        // console.log('data',data);
        res.status(200).json({ message: 'working hours set successfully', booked_appointments: booked_appointments });
    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false });
    }
}

exports.getAppointment = async (req, res) => {

    try {

        
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                { model: Service, include: [Specialization] },
                { model: Employee }
            ]
        });


        res.status(200).json({ appointment: appointment });
    }
    catch (err) {

        console.log(err);
        res.status(500).json({ success: false });
    }
}

exports.deleteAppointment = async (req, res) => {
    const t = await sequelize.transaction();

    try {

        const id = req.params.id;

        const appointment = await Appointment.findByPk(id);
        console.log(appointment);

        appointment.destroy();

        await t.commit();

        res.status(200).json({ message: 'appointment deleted successfully', appointment: appointment });

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false });
    }
}


exports.rescheduleAppointment = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const { date, time } = req.body;

        // console.log(date, time);

        const appointment = await Appointment.findByPk(req.params.id);

        const service = await Service.findByPk(appointment.serviceId);

        const [h, m, s] = time.split(":").map(Number);

        const dateObj = new Date();
        dateObj.setHours(h, m + parseInt(service.duration), s || 0);

        const result = await appointment.update({ date: date, start_time: time, end_time: dateObj.toTimeString().split(" ")[0] }, { transaction: t });

        console.log(res);

        await t.commit();

        res.status(202).json({ success: true, appointment: result });

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });

    }

}



// SEND CONFIRMATION AND INVOICE IN EMAIL.
async function sendConfirmationEmail(user, salon, invoicePath) {
    try {
        const client = SibApiV3Sdk.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

        const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi(); // transactional email api when we need to send some confirmation or reset . and another is EmailCampaign is used when we have a newsletter or something like that.

        const sender = {
            email: 'nirmalgadekar2796@gmail.com',
            name: 'SALON APPOINTMENT'
        }

        const receiver = [
            {
                email: user.email
            }
        ]

        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject: 'Appointment Confirmation - Invoice Attached',
            htmlContent: `<p>Hi <strong>Client Name</strong>,</p>
                            <p>Your appointment has been successfully confirmed.</p>
                            <p>Please find the attached invoice for your reference.</p>
                            <p>Thank you,<br>${salon.name}</p>`,
            attachment: [{
                content: fs.readFileSync(invoicePath, { encoding: 'base64' }),
                name: 'Invoice.pdf'
            }]
        });
        console.log('done');

    }
    catch (error) {
        console.log(error);
    }
}