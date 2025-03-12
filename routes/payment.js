const express=require('express');

const router=express.Router();

const userAuthentication=require('../middleware/userAuthentication');
const paymentController=require('../controller/payment');

router.post('/appointment_payment',userAuthentication.authentication,paymentController.appointmentPayment);

router.post('/updateTransactions',userAuthentication.authentication,paymentController.updateTransaction);



module.exports=router;

