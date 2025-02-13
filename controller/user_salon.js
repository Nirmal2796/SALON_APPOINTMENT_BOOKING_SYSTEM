const sequelize=require('../util/database');
const Salon = require('../models/salon');
const Service=require('../models/service');
const Working_Hours=require('../models/working_hours');
// const Closed_Period=require('../models/closed_period');
const Employee=require('../models/employee');

exports.getSalons=async (req,res) => {
    try {

        const salons=await Salon.findAll();

        res.status(200).json({salons:salons});

        
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

exports.getSalon=async (req,res) => {
    try {

        const id= req.params.id;

        const salon=await Salon.findByPk(id);

        const services=await Service.findAll({
            where:{
                salonId:id
            }
        });

        const working_hours=await Working_Hours.findAll({
            where:{
                salonId:id
            }
        });

        const employee=await Employee.findAll({
            where:{
                salonId:id
            }
        });

        res.status(200).json({salon:{salon,services,working_hours,employee}});

        
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}