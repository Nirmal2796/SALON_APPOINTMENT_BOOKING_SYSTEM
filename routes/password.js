const express=require('express');

const router=express.Router();

const passwordController=require('../controller/password');



router.post('/forgotpassword',passwordController.forgotPassword);

router.get('/resetpassword/:uid',passwordController.resetPassword);

router.get('/updatepassword/:uid',passwordController.updatePassword);

module.exports=router;