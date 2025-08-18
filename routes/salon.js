const express=require('express');

const router=express.Router();

const salonController=require('../controller/salon');

const salonAuthentication=require('../middleware/salonAuthentication');



router.post('/bussiness-signup',salonController.postSignupUser);

router.post('/bussiness-login',salonController.postLoginUser);

// router.get('/get-user',salonAuthentication.authentication,userController.getUser);

// router.post('/edit-profile',salonAuthentication.authentication,userController.editProfile);

router.get('/salon-validate-token',salonAuthentication.authentication,salonController.validateToken);

router.get('/get-some-appointments',salonAuthentication.authentication,salonController.getSomeAppointments);

router.get('/get-appointments',salonAuthentication.authentication,salonController.getAppointments);

module.exports=router;
