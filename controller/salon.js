const bcrypt = require('bcrypt');

const Appointment=require('../models/appointment');
const Salon = require('../models/salon');
const Service = require('../models/service');
const Employee = require('../models/employee');
const Review=require('../models/review');
const JWTServices = require('../services/JWTservices');
const sequelize = require('../util/database');


exports.postSignupUser = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        email = req.body.email;
        uname = req.body.name;
        password = req.body.password;


        const user = await Salon.findAll({ where: { email: email } })


        if (user.length > 0) {
            res.status(403).json('User Already Exists');
        }
        else {

            bcrypt.hash(password, 10, async (err, hash) => {

                if (!err) {
                    const newUser = await Salon.create({
                        email: email,
                        name: uname,
                        password: hash
                    }, { transaction: t });

                    await t.commit();

                    res.status(201).json({ newUser: newUser, message: 'User registered Successfully...Please Log In' });
                }
                else {
                    throw new Error('Something went wrong');
                }
            })
        }
    }
    catch (err) {
        await t.rollback();
        res.status(500).json({ success: false, message: err });
    }

}


exports.postLoginUser = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Salon.findAll({ where: { email } });

        if (user.length > 0) {


            bcrypt.compare(password, user[0].password, (err, result) => {

                if (err) {
                    throw new Error('Something Went Wrong');
                }
                if (result) {
                    res.status(200).json({ message: 'User logged in Successfully', token: JWTServices.generateToken(user[0].id) });
                }
                else {
                    res.status(401).json({ message: ' User not authorized' });
                }
            })

        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err });
    }

};

exports.validateToken = async (req, res) => {
    res.status(200).json({ status: 'success' });
}


exports.getSomeAppointments = async (req, res) => {

    try {

        const today = new Date();

        // console.log(req.user);

        const appointments = await req.user.getAppointments({
            limit: 5,                          // only 3 records
            order: [['date', 'DESC']]      // latest first
        });

        // let appointmentsDetails=[];

        for (let appointment of appointments) {

            // const salon = await Salon.findByPk(appointment.salonId);
            const service = await Service.findByPk(appointment.serviceId);
            const employee = await Employee.findByPk(appointment.employeeId);

            // appointment.salonId = salon;
            appointment.serviceId = service;
            appointment.employeeId = employee;

        }

        // console.log(appointments);

        res.status(200).json({ appointments: appointments });
    }
    catch (err) {

        console.log(err);
        res.status(500).json({ success: false });
    }
}

exports.getAppointments = async (req, res) => {

    try {

        const today = new Date();

        const appointments = await req.user.getAppointments({
            order: [['date', 'DESC']]   
        });

        // let appointmentsDetails=[];

        for (let appointment of appointments) {

            // const salon = await Salon.findByPk(appointment.salonId);
            const service = await Service.findByPk(appointment.serviceId);
            const employee = await Employee.findByPk(appointment.employeeId);

            // appointment.salonId = salon;
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

exports.editProfile = async (req, res) => {

    const t=await sequelize.transaction();

    try{

        const userId=req.user.id;
        const email = req.body.email;
        const uname = req.body.username;
        const password = req.body.password;

        const user = await Salon.findByPk(userId);

        if(user){
            bcrypt.hash(password, 10, async (err, hash) => {

                if (!err) {
                    user.email=email;
                    user.name=uname;
                    user.password=hash;
    
                    await user.save({transaction:t});
    
                    await t.commit();
    
                    res.status(200).json({ message: 'Salon Profile Updated Successfully' });
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


exports.getSalon=async (req, res) => {


    try{

        const user = await Salon.findByPk(req.user.id);

        if(user){
            res.status(200).json({salon:user});
        }
        else{
            res.status(404).json({ message: 'User not found'});
        }
       
    }
    catch (err) {
        res.status(500).json({ success: false, message: err });
    }
};

exports.getReview = async (req, res) => {
    try {

        
        const reviews = await Review.findAll({ where: {salonId:req.user.id} });


        console.log(req.user.id);

        res.status(200).json({ message: 'successful', reviews: reviews });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
}

exports.getTotalReview = async (req, res) => {
    try {

        const salonId = req.user.id;
        const reviews = await Review.findAll({ where: {salonId} });

        const total = reviews.length;
        const avg = reviews.reduce((sum, r) => sum + Number(r.rate), 0) / total;
        

        res.status(200).json({ message: 'successful', total:total , avg:avg  });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
}

exports.addReply =async (req, res) => {

    const t = await sequelize.transaction();

    try {
        
        const reply = req.body.replyText;
        const reviewId=req.params.id;

        const review=await Review.findByPk(reviewId);

        console.log(reply);
        await review.update({reply:reply});
        

        await t.commit();

        res.status(200).json({ message: 'successful', review: review });

    } catch (error) {

        await t.rollback();
        console.log(error);
        res.status(500).json({ success: false });
    }
}
// module.exports = { postLoginUser, postSignupUser, validateToken , getSomeAppointments , getAppointments ,getSalon ,editProfile};