const express=require('express');

const router=express.Router();

const closedPeriodController=require('../controller/closed_period');

const salonAuthentication=require('../middleware/salonAuthentication');




router.get('/get-closed-period',salonAuthentication.authentication,closedPeriodController.getClosedPeriod);

router.post('/set-closed-period',salonAuthentication.authentication,closedPeriodController.addClosedPeriod);

router.delete('/delete-closed-period/:id',salonAuthentication.authentication,closedPeriodController.deleteClosedPeriod);



module.exports=router;
