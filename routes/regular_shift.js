const express=require('express');

const router=express.Router();

const regularShiftController=require('../controller/regular_shift');

const salonAuthentication=require('../middleware/salonAuthentication');




router.get('/get-regular-shift',salonAuthentication.authentication,regularShiftController.getRegularShifts);

router.post('/set-regular_shift',salonAuthentication.authentication,regularShiftController.addRegularShift);


module.exports=router;
