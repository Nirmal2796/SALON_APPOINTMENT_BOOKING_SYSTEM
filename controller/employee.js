const sequelize=require('../util/database');
const Specialization=require('../models/specialization');
const Employee_Specialization=require('../models/employee_specialization');
const Employee = require('../models/employee');
// const { where } = require('sequelize');

exports.addEmployee=async (req,res)=>{
    const t=await sequelize.transaction();

    try {

        const specialization_arr=req.body.specialization;

        for(let specialization in specialization_arr){

            const found_specialization=await Specialization.findOne({where:{
                name:{specialization}
            }});
    
            const employee=await req.user.createEmployee({
                name:req.body.name,
                email:req.body.email,
                start_date:new Date().toJSON().slice(0, 10)
            },{transaction:t});
    
            await Employee_Specialization.create({
                employeeId:employee.id,
                specializationId:found_specialization.id
            },{transaction:t});
        }


        await t.commit();

        res.status(200).json({employee:employee,message:'Employee added successfully'});
        
    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({message:'Something went wrong'});
    }
}

exports.getEmployees=async (req,res)=>{
    // const t=await sequelize.transaction();

    try {

        // const specialization=Specialization.findOne({where:{
        //     name:{req.body.specialization}
        // }})

        const employee=await req.user.getEmployees();

        

        // await t.commit();

        res.status(200).json({employees:employee});
        
    } catch (error) {
        // await t.rollback();
        console.log(error);
        res.status(500).json({message:'Something went wrong'});
    }
}

exports.editEmployee=async (req,res)=>{
    const t=await sequelize.transaction();

    try {
        const employee=await Employee.findByPk(req.params.id);

        const newEmployee=await employee.update({
            name:req.body.name,
            email:req.body.email,
            start_date:new Date().toJSON().slice(0, 10)
        },{transaction:t})

        await t.commit();

        res.status(200).json({employee:newEmployee,message:'Employee added successfully'});
        
    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({message:'Something went wrong'});
    }
}