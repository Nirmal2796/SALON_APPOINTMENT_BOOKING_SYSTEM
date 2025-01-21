const express=require('express');

const router=express.Router();

const serviceController=require('../controller/service');

const salonAuthentication=require('../middleware/salonAuthentication');




router.get('/get-salon-services',salonAuthentication.authentication,serviceController.getServices);

router.post('/add-service',salonAuthentication.authentication,serviceController.addService);

router.get('/get-service-details/:id',salonAuthentication.authentication,serviceController.getServiceDetails);

router.post('/edit-service/:id',salonAuthentication.authentication,serviceController.editService);

router.delete('/delete-service/:id',salonAuthentication.authentication,serviceController.deleteService);

// router.get('/validate-token',salonAuthentication.authentication,userController.validateToken);

module.exports=router;
