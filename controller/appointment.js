const sequelize=require('../util/database');
const Appointment=require('../models/appointment');
const Service=require('../models/service');
const Salon=require('../models/salon');
const Employee=require('../models/employee');
const Specialization =require('../models/specialization');

exports.getAppointments=async(req,res)=>{

    try{

        const appointments=await req.user.getAppointments();

        // let appointmentsDetails=[];

        for(let appointment of appointments){

            const salon=await Salon.findByPk(appointment.salonId);
            const service=await Service.findByPk(appointment.serviceId);
            const employee=await Employee.findByPk(appointment.employeeId);

            appointment.salonId=salon;
            appointment.serviceId=service;
            appointment.employeeId=employee;

        }

        res.status(200).json({appointments:appointments});
    }
    catch (err) {

        console.log(err);
        res.status(500).json({success:false});
    }
}

exports.addAppointment=async(req,res)=>{

    const t=await sequelize.transaction();

    try{

        const salonId=req.body.salonId;

        const appointments=req.body.appointments;

        // console.log(appointments);
        // let services=[];

        let booked_appointments=[];

        for(const a of appointments){

            // console.log(a);

            const formattedDate = new Date(a.date);

            const service=await Service.findAll({
                where:{
                    name:a.serviceName
                }
            });

            // console.log(service);

            const employee=await Employee.findByPk(a.specialistId);
            
            booked_appointments.push(await Appointment.create({
                salonId:salonId,
                userId:req.user.id,
                serviceId:service[0].id , //i will have to search the service then attach it here.
                date:formattedDate,
                employeeId:employee.id
            },{transaction:t}));

            

        }
        
        await t.commit();

        // console.log('data',data);
        res.status(200).json({message:'working hours set successfully',booked_appointments:booked_appointments});
    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}

exports.getAppointment=async(req,res)=>{

    try{

        const appointment=await Appointment.findByPk(req.params.id);

            const service=await Service.findByPk(appointment.serviceId);
            const employee=await Employee.findByPk(appointment.employeeId);
            const specialization=await Specialization.findByPk(service.specializationId);

            appointment.serviceId=service;
            appointment.employeeId=employee;
            appointment.serviceId.specializationId=specialization;
        

        res.status(200).json({appointment:appointment});
    }
    catch (err) {

        console.log(err);
        res.status(500).json({success:false});
    }
}

exports.deleteAppointment=async(req,res)=>{
    const t= await sequelize.transaction();

    try {

        const id = req.params.id;

        const appointment=await Appointment.findByPk(id);
        console.log(appointment);

        appointment.destroy();

        await t.commit();

        res.status(200).json({message:'appointment deleted successfully', appointment:appointment});

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}