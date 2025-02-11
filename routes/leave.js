const express=require('express');

const router=express.Router();

const leaveController=require('../controller/leave');

const salonAuthentication=require('../middleware/salonAuthentication');




router.get('/get-leave/:id',salonAuthentication.authentication,leaveController.getLeave);

router.post('/set-leave/:id',salonAuthentication.authentication,leaveController.addLeave);

router.delete('/delete-leave/:id',salonAuthentication.authentication,leaveController.deleteLeave);



module.exports=router;
