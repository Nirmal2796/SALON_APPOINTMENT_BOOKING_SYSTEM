const express=require('express');

const router=express.Router();

const SpecializationController=require('../controller/employee');

const salonAuthentication=require('../middleware/salonAuthentication');




router.get('/get-employees',salonAuthentication.authentication,SpecializationController.getEmployees);

router.post('/add-employee',salonAuthentication.authentication,SpecializationController.addEmployee);

// router.delete('/delete-closed-period/:id',salonAuthentication.authentication,closedPeriodController.deleteClosedPeriod);



module.exports=router;
