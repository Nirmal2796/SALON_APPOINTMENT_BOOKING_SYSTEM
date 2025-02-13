const express=require('express');

const router=express.Router();

const userSalonController=require('../controller/user_salon');

const userAuthentication=require('../middleware/userAuthentication');


router.get('/get-salons',userAuthentication.authentication,userSalonController.getSalons);

router.get('/get-salon/:id',userAuthentication.authentication,userSalonController.getSalon);



module.exports=router;
