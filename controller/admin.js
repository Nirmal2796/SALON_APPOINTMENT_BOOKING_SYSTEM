const bcrypt = require('bcrypt');


const Admin = require('../models/admin');
const User = require('../models/user');
const Appointment = require('../models/appointment');
const Service = require('../models/service');
const Salon = require('../models/salon');
const Employee = require('../models/employee');
const Specialization = require('../models/specialization');
const JWTServices=require('../services/JWTservices');
const sequelize = require('../util/database');


exports.postLoginAdmin = async (req, res) => {

    try{
        const email = req.body.email;
        const password = req.body.password;
    
        const admin = await Admin.findAll({where:{email}});

        console.log(email,password,admin);
    
        if (admin.length>0) {

            
            bcrypt.compare(password,admin[0].password,(err,result)=>{

                if(err){
                    throw new Error('Something Went Wrong');
                }
                if(result){
                    res.status(200).json({ message: 'Admin logged in Successfully' , token: JWTServices.generateToken(admin[0].id) });
                }
                else{
                    res.status(401).json({ message: ' Admin not authorized' });
                }
            })
           
        }
        else {
            res.status(404).json({ message: 'admin not found'});
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err });
    }

};

exports.getAllUsers=async (req, res) => {


    try{

        const users = await User.findAll();

        
        res.status(200).json({users:users});
        
       
    }
    catch (err) {
        res.status(500).json({ success: false, message: err });
    }
};

exports.getUser=async (req, res) => {


    try{

        const user = await User.findByPk(req.params.id);

        if(user){
            res.status(200).json({user:user});
        }
        else{
            res.status(404).json({ message: 'User not found'});
        }
       
    }
    catch (err) {
        res.status(500).json({ success: false, message: err });
    }
};

exports.deleteUser = async (req, res) => {
    const t = await sequelize.transaction();

    try {

        const id = req.params.id;

        const user = await User.findByPk(id);
        console.log(user);

        user.destroy();

        await t.commit();

        res.status(200).json({ message: 'user deleted successfully', user: user });

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false });
    }
}


exports.editProfile = async (req, res) => {

    const t=await sequelize.transaction();

    try{

        const userId=req.body.id;
        const email = req.body.email;
        const uname = req.body.username;
        const password = req.body.password;

        const user = await User.findByPk(userId);

        if(user){
            bcrypt.hash(password, 10, async (err, hash) => {

                if (!err) {
                    user.email=email;
                    user.name=uname;
                    user.password=hash;
    
                    await user.save({transaction:t});
    
                    await t.commit();
    
                    res.status(200).json({ message: 'User Profile Updated Successfully' });
                }
                else {
                    throw new Error('Something went wrong');
                }
            })
        }
        else{
            res.status(404).json({ message: 'User not found'});
        }
       
    }
    catch (err) {
        res.status(500).json({ success: false, message: err });
    }
};

exports.getAllAppointments = async (req, res) => {

    try {

        const today = new Date();
        
        const appointments = await Appointment.findAll();

        // let appointmentsDetails=[];

        for (let appointment of appointments) {

            const user=await User.findByPk(appointment.userId);
            const salon = await Salon.findByPk(appointment.salonId);
            const service = await Service.findByPk(appointment.serviceId);
            const employee = await Employee.findByPk(appointment.employeeId);

            appointment.userId=user;
            appointment.salonId = salon;
            appointment.serviceId = service;
            appointment.employeeId = employee;

        }

        res.status(200).json({ appointments: appointments });
    }
    catch (err) {

        console.log(err);
        res.status(500).json({ success: false });
    }
}

exports.getAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findByPk(req.params.id);

        const service = await Service.findByPk(appointment.serviceId);
        const employee = await Employee.findByPk(appointment.employeeId);
        const specialization = await Specialization.findByPk(service.specializationId);

        appointment.serviceId = service;
        appointment.employeeId = employee;
        appointment.serviceId.specializationId = specialization;


        res.status(200).json({ appointment: appointment });
    }
    catch (err) {

        console.log(err);
        res.status(500).json({ success: false });
    }
}

exports.deleteAppointment = async (req, res) => {
    const t = await sequelize.transaction();

    try {

        const id = req.params.id;

        const appointment = await Appointment.findByPk(id);
        console.log(appointment);

        appointment.destroy();

        await t.commit();

        res.status(200).json({ message: 'appointment deleted successfully', appointment: appointment });

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false });
    }
}

exports.rescheduleAppointment = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const { date, time } = req.body;

        // console.log(date, time);

        const appointment = await Appointment.findByPk(req.params.id);

        const service = await Service.findByPk(appointment.serviceId);

        const [h, m, s] = time.split(":").map(Number);

        const dateObj = new Date();
        dateObj.setHours(h, m + parseInt(service.duration), s || 0);

        const result = await appointment.update({ date: date, start_time: time ,end_time: dateObj.toTimeString().split(" ")[0] }, { transaction: t });

        console.log(res);

        await t.commit();

        res.status(202).json({ success: true, appointment: result });

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });

    }

}
