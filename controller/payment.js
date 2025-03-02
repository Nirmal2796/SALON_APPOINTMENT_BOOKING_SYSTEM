const Razorpay = require('razorpay');

const sequelize = require('../util/database');

const Payment = require('../models/payment');
const JWTServices=require('../services/JWTservices');

exports.appointmentPayment = async (req, res) => {

    const t=await sequelize.transaction();

    try {

        
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = req.body.amount;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(err);
            }
            else {
                userOrder = {
                    orderid: order.id,
                    status: 'PENDING'
                };

                console.log(userOrder);
                await req.user.createPayment(userOrder,{transaction:t})
                await t.commit();

                return res.status(201).json({ order, key_id: rzp.key_id });

            }
        })
    }
    catch (err) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Something went wrong' });

    }
}


exports.updateTransaction = async (req, res) => {

    const t=await sequelize.transaction();

    try {

        const { order_id, payment_id,status } = req.body;

        console.log(order_id, 'paymentid ',payment_id, 'status',status);
        const payment =await Payment.findOne({ where: { orderid: order_id } });
        // console.log(order);
        let update1 ;
        let update2 ;
        if(status=='successful'){
            update1=payment.update({ paymentid: payment_id, status: 'SUCCESSFUL' },{transaction:t});
            // update2=req.user.update({ ispremiumuser: true },{transaction:t});
            
        }
        else{
            update1 = payment.update({ payment_id: payment_id, status: 'FAILED' },{transaction:t});
            // update2 = req.user.update({ ispremiumuser: false },{transaction:t});           
        }

        await Promise.all([update1, update2]);

        await t.commit();
        res.status(202).json({ success: true, message: status});

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });

    }

}