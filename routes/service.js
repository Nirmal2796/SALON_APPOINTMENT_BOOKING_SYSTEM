const express=require('express');

const router=express.Router();

const serviceController=require('../controller/service');

const salonAuthentication=require('../middleware/salonAuthentication');




router.get('/get-services',salonAuthentication.authentication,serviceController.getServices);

router.post('/add-service',salonAuthentication.authentication,serviceController.addService);

// router.get('/validate-token',salonAuthentication.authentication,userController.validateToken);

module.exports=router;
