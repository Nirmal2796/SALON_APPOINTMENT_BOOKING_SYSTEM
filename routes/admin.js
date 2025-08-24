const express=require('express');

const router=express.Router();

const adminController=require('../controller/admin');

const adminAuthentication=require('../middleware/adminAuthentication');




router.post('/admin-login',adminController.postLoginAdmin);

router.get('/get-admin-user/:id',adminAuthentication.authentication,adminController.getUser);

router.get('/get-all-users',adminAuthentication.authentication,adminController.getAllUsers);

router.post('/edit-admin-user-profile/:id',adminAuthentication.authentication,adminController.editProfile);

router.get('/get-appointment',adminAuthentication.authentication,adminController.getAppointment);

router.get('/get-all-appointments',adminAuthentication.authentication,adminController.getAllAppointments);

router.post('/reschedule-admin-appointment/:id',adminAuthentication.authentication,adminController.rescheduleAppointment);

router.delete('/delete-admin-appointment/:id',adminAuthentication.authentication,adminController.deleteAppointment);

router.delete('/delete-admin-user/:id',adminAuthentication.authentication,adminController.deleteUser);

module.exports=router;
