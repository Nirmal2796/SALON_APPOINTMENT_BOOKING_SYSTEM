const sequelize=require('../util/database');
const Specialization=require('../models/specialization');
const Employee_Specialization=require('../models/employee_specialization');
const Employee = require('../models/employee');

exports.addEmployee=async (req,res)=>{
    const t=await sequelize.transaction();

    try {

        const specialization=req.body.specialization;

        console.log(specialization);

        const employee=await req.user.createEmployee({
            name:req.body.name,
            email:req.body.email,
            start_date:req.body.start_date
        },{transaction:t});


        // for(let specialization in specialization_arr){

            const found_specialization=await Specialization.findOne({where:
                {name:specialization}
            });
    
            console.log(found_specialization);
            
            const d=await Employee_Specialization.create({
                employeeId:employee.id,
                specializationId:found_specialization.id
            },{transaction:t});

            // console.log(d);
        // }


        await t.commit();

        res.status(200).json({employee:{employee,specialization:found_specialization},message:'Employee added successfully'});
        
    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({message:'Something went wrong'});
    }
}

exports.getEmployees=async (req,res)=>{
    // const t=await sequelize.transaction();

    try {

        
        const employee=await req.user.getEmployees();

        for(let e in employee){
            const s=await Employee_Specialization.findAll({
                where:{
                    employeeId:employee[e].id
                }
            });
            const specialization=await Specialization.findByPk(s[0].specializationId);

            employee[e]={employee:employee[e],specialization:specialization};
        }

        

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
            start_date:req.body.start_date
        },{transaction:t})

        await t.commit();

        res.status(200).json({employee:newEmployee,message:'Employee updated successfully'});
        
    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({message:'Something went wrong'});
    }
}