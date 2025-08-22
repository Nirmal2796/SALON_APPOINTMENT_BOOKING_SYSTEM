const express=require('express');

const router=express.Router();

const adminController=require('../controller/admin');

const adminAuthentication=require('../middleware/adminAuthentication');




router.post('/admin-login',adminController.postLoginAdmin);

router.get('/get-user',adminAuthentication.authentication,adminController.getUser);

router.get('/get-all-users',adminAuthentication.authentication,adminController.getAllUsers);

router.post('/edit-user-profile',adminAuthentication.authentication,adminController.editProfile);

router.get('/get-appointment',adminAuthentication.authentication,adminController.getAppointment);

router.get('/get-all-appointments',adminAuthentication.authentication,adminController.getAllAppointments);

router.post('/edit-appointment',adminAuthentication.authentication,adminController.editAppointment);


module.exports=router;
