const express=require('express');

const router=express.Router();

const appointment=require('../controller/appointment');

const userAuthentication=require('../middleware/userAuthentication');


router.get('/get-appointments',userAuthentication.authentication,appointment.getAppointments);

router.post('/add-apointment',userAuthentication.authentication,appointment.addAppointment);

router.get('/get-appointment/:id',userAuthentication.authentication,appointment.getAppointment);

router.delete('/delete-appointment/:id',userAuthentication.authentication,appointment.deleteAppointment);



module.exports=router;
