const express=require('express');

const router=express.Router();

const appointmentContorller=require('../controller/appointment');

const userAuthentication=require('../middleware/userAuthentication');


router.get('/get-appointments',userAuthentication.authentication,appointmentContorller.getAppointments);

router.post('/add-apointment',userAuthentication.authentication,appointmentContorller.addAppointment);

router.post('/reschedule-appointment/:id',userAuthentication.authentication,appointmentContorller.rescheduleAppointment);

router.get('/get-appointment/:id',userAuthentication.authentication,appointmentContorller.getAppointment);

router.delete('/delete-appointment/:id',userAuthentication.authentication,appointmentContorller.deleteAppointment);



module.exports=router;
