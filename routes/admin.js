const express=require('express');

const router=express.Router();

const adminController=require('../controller/admin');

const adminAuthentication=require('../middleware/adminAuthentication');




router.post('/admin-login',adminController.postLoginAdmin);


module.exports=router;
