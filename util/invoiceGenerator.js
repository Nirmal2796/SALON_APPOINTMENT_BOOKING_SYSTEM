const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Appointment = require('../models/appointment');
const Payment = require('../models/payment');
const Service=require('../models/service');

exports.generateInvoice = async function(paymentId, user) {
    try {
        const appointments = await Appointment.findAll({ where: { paymentId } });
        const payment = await Payment.findOne({ where: { id: paymentId } });

        if (!appointments || !payment) {
            throw new Error('Invalid payment ID');
        }

        const doc = new PDFDocument();
        const invoiceDir = path.join(__dirname, '..', 'public', 'invoices', `${user.id}`);
        
        // Create invoices folder if not exists
        if (!fs.existsSync(invoiceDir)) {
            fs.mkdirSync(invoiceDir, { recursive: true });  // `recursive` ensures nested folders are created
        }

        const now = new Date();
        const dateOnly = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const timeOnly = `${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

        const filePath = path.join(invoiceDir, `${dateOnly}_${timeOnly}_invoice.pdf`);
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // -- Now writing invoice details --
        doc.fontSize(25).text('Salon Invoice', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text(`Payment ID: ${payment.paymentid}`);
        doc.text(`Customer Name: ${user.name || 'Unknown'}`);
        doc.moveDown();

        let totalAmount = 0;
        let count = 1;

        doc.fontSize(16).text('Services:', { underline: true });
        doc.moveDown(0.5);

        for(const a of appointments){

            const service = await Service.findByPk(a.serviceId);

            doc.fontSize(14).text(`${count}.  ${service.name} - INR ${service.price}`);
            totalAmount += service.price;
            count++;
        }
        // appointments.forEach(service => {
        // });

        doc.moveDown();
        doc.fontSize(18).text(`Total Amount: INR ${totalAmount}`, { align: 'right' });

        doc.end();

        // Return promise after stream finishes
        await new Promise(resolve => writeStream.on('finish', resolve));

        console.log('Invoice generated successfully for Payment ID:', paymentId);

    } catch (error) {
        console.error('Failed to generate invoice:', error.message);
        throw error;
    }
}