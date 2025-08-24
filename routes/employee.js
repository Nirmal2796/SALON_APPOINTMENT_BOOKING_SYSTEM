const express=require('express');

const router=express.Router();

const SpecializationController=require('../controller/employee');

const salonAuthentication=require('../middleware/salonAuthentication');




router.get('/get-employees',salonAuthentication.authentication,SpecializationController.getEmployees);

router.get('/get-employee/:id',salonAuthentication.authentication,SpecializationController.getEmployee);

router.get('/get-employee-appintments/:id',salonAuthentication.authentication,SpecializationController.getAppointments);

router.post('/edit-employee/:id',salonAuthentication.authentication,SpecializationController.editEmployee);

router.post('/edit-employee-specializations/:id',salonAuthentication.authentication,SpecializationController.editEmployeeSpecilization);

router.post('/add-employee',salonAuthentication.authentication,SpecializationController.addEmployee);

// router.delete('/delete-closed-period/:id',salonAuthentication.authentication,closedPeriodController.deleteClosedPeriod);



module.exports=router;
