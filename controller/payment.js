const Razorpay = require('razorpay');

const sequelize = require('../util/database');

const Payment = require('../models/payment');
// const JWTServices=require('../services/JWTservices');

exports.appointmentPayment = async (req, res) => {

    const t=await sequelize.transaction();

    try {

        
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = parseInt(req.body.amount)*100;
        // const amount=500000;

        // console.log('AMOUNT >>>>>>>>>>>>>>>' , amount );

        rzp.orders.create({ amount:amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(err);
            }
            else {
                userOrder = {
                    orderid: order.id,
                    status: 'PENDING'
                };

                // console.log(userOrder);
                await req.user.createPayment(userOrder,{transaction:t})
                await t.commit();

                return res.status(201).json({ order, key_id: rzp.key_id });

            }
        });
        
    }
    catch (err) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Something went wrong' ,err:err});

    }
}


exports.updateTransaction = async (req, res) => {

    const t=await sequelize.transaction();

    try {

        const { order_id, payment_id,status } = req.body;

        // console.log(order_id, 'paymentid ',payment_id, 'status',status);
        const payment =await Payment.findOne({ where: { orderid: order_id } });
        // console.log(payment_id);

        
        // let update1 ;

        if(status=='successful'){
            await payment.update({ paymentid: payment_id, status: 'SUCCESSFUL' },{transaction:t});
 
        }
        else{
            await payment.update({ paymentid: payment_id, status: 'FAILED' },{transaction:t});
                 
        }

        // await Promise.all([update1]);

        await t.commit();
        res.status(202).json({ success: true, message: status, payment: payment});

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });

    }

}