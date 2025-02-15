const express=require('express');

const router=express.Router();

const userSalonController=require('../controller/user_salon');

const userAuthentication=require('../middleware/userAuthentication');


router.get('/get-salons',userAuthentication.authentication,userSalonController.getSalons);

router.get('/get-salon/:id',userAuthentication.authentication,userSalonController.getSalon);

router.get('/get-closedPeriod/:id',userAuthentication.authentication,userSalonController.getClosedPeriod);

router.get('/get-specialits/:id',userAuthentication.authentication,userSalonController.getSpecialists);



module.exports=router;
