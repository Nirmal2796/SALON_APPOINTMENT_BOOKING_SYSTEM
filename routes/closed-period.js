const express=require('express');

const router=express.Router();

const closedPeriodController=require('../controller/closed_period');

const salonAuthentication=require('../middleware/salonAuthentication');




// router.get('/get-salon-services',salonAuthentication.authentication,serviceController.getWorkingHours);

router.post('/set-closed-period',salonAuthentication.authentication,closedPeriodController.addClosedPeriod);


module.exports=router;
