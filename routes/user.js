const express=require('express');

const router=express.Router();

const userController=require('../controller/user');

const userAuthentication=require('../middleware/userAuthentication');



router.post('/signup',userController.postSignupUser);

router.post('/login',userController.postLoginUser);

router.get('/get-user',userAuthentication.authentication,userController.getUser);

router.post('/edit-profile',userAuthentication.authentication,userController.editProfile);

router.get('/validate-token',userAuthentication.authentication,userController.validateToken);


module.exports=router;
