const express=require('express');

const router=express.Router();

const aiController=require('../controller/aihelp');

const userAuthentication=require('../middleware/userAuthentication');




router.post('/ask-ai',userAuthentication.authentication,aiController.askAi);



module.exports=router;
