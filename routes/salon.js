const express=require('express');

const router=express.Router();

const salonController=require('../controller/salon');

const salonAuthentication=require('../middleware/salonAuthentication');



router.post('/bussiness-signup',salonController.postSignupUser);

router.post('/bussiness-login',salonController.postLoginUser);

router.get('/get-salon',salonAuthentication.authentication,salonController.getSalon);

router.post('/edit-salon-profile',salonAuthentication.authentication,salonController.editProfile);

router.get('/salon-validate-token',salonAuthentication.authentication,salonController.validateToken);

router.get('/get-some-appointments',salonAuthentication.authentication,salonController.getSomeAppointments);

router.get('/get-salon-appointments',salonAuthentication.authentication,salonController.getAppointments);

router.get('/get-reviews',salonAuthentication.authentication,salonController.getReview);

router.get('/get-total-reviews',salonAuthentication.authentication,salonController.getTotalReview);

router.post('/add-reply/:id',salonAuthentication.authentication,salonController.addReply);

module.exports=router;
