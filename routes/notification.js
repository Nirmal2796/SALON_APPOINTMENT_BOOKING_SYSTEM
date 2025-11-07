const express=require('express');

const router=express.Router();

const notificationController=require('../controller/notification');

const userAuthentication=require('../middleware/userAuthentication');

const salonAuthentication=require('../middleware/salonAuthentication');


router.get('/get-notifications',salonAuthentication.authentication,notificationController.getNotification);

router.post('/send-notification',userAuthentication.authentication,notificationController.sendNotification);

router.put('/update-seen-notification',salonAuthentication.authentication,notificationController.updateNotification);

module.exports=router;