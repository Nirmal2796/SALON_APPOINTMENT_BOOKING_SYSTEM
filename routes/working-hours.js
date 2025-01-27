const express=require('express');

const router=express.Router();

const workingHoursController=require('../controller/working_hours');

const salonAuthentication=require('../middleware/salonAuthentication');




// router.get('/get-salon-services',salonAuthentication.authentication,serviceController.getWorkingHours);

router.post('/set-working-hours',salonAuthentication.authentication,workingHoursController.addWorkingHours);


module.exports=router;
