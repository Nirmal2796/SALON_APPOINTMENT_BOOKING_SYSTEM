const express=require('express');

const router=express.Router();

const workingHoursController=require('../controller/working_hours');

const salonAuthentication=require('../middleware/salonAuthentication');



//The :id? means the id is optional.
router.get('/get-working-hours',salonAuthentication.authentication,workingHoursController.getWorkingHours);

router.post('/set-working-hours',salonAuthentication.authentication,workingHoursController.addWorkingHours);


module.exports=router;
