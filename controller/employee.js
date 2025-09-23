const sequelize = require('../util/database');
const Specialization = require('../models/specialization');
const Employee_Specialization = require('../models/employee_specialization');
const Employee = require('../models/employee');
const Appointment=require('../models/appointment');
const Service = require('../models/service');


exports.addEmployee = async (req, res) => {
    const t = await sequelize.transaction();

    try {

        const specialization_arr = req.body.specialization;

        // console.log('specialization_arr',specialization_arr);

        //Create Employee
        const employee = await req.user.createEmployee({
            name: req.body.name,
            email: req.body.email,
            start_date: req.body.start_date
        }, { transaction: t });

        
        const specializations = [];


        //Add specializations to employee
        for (let specialization in specialization_arr) {

            const found_specialization = await Specialization.findOne({
                where:
                    { name: specialization_arr[specialization] }
            });

            // console.log('specialization' ,found_specialization);

            specializations.push(found_specialization);

            const d = await Employee_Specialization.create({
                employeeId: employee.id,
                specializationId: found_specialization.id
            }, { transaction: t });

            console.log(d);
        }


        await t.commit();

        res.status(200).json({ employee: { employee, specialization: specializations }, message: 'Employee added successfully' });

    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

exports.getEmployees = async (req, res) => {
    // const t=await sequelize.transaction();

    try {


        const employee = await req.user.getEmployees();

        for (let e in employee) {
            const emp_spec = await Employee_Specialization.findAll({
                where: {
                    employeeId: employee[e].id
                }
            });

            const specializations = [];

            for (let s in emp_spec) {
                specializations.push(await Specialization.findByPk(emp_spec[s].specializationId));
            }

            employee[e] = { employee: employee[e], specialization: specializations };
        }



        // await t.commit();

        res.status(200).json({ employees: employee });

    } catch (error) {
        // await t.rollback();
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

exports.getEmployee = async (req, res) => {
    // const t=await sequelize.transaction();

    try {

        const id = req.params.id;

        const employee = await Employee.findByPk(id);

        const emp_spec = await Employee_Specialization.findAll({
            where: {
                employeeId: employee.id
            }
        });

        const specializations = [];

        for (let s in emp_spec) {
            specializations.push(await Specialization.findByPk(emp_spec[s].specializationId));
        }



        // await t.commit();

        res.status(200).json({ employee: { employee: employee, specialization: specializations } });

    } catch (error) {
        // await t.rollback();
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

exports.editEmployee = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const employee = await Employee.findByPk(req.params.id);

        const newEmployee = await employee.update({
            name: req.body.name,
            email: req.body.email,
            start_date: req.body.start_date
        }, { transaction: t });

        // console.log(newEmployee);

        await t.commit();

        res.status(200).json({ employee: newEmployee, message: 'Employee updated successfully' });

    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

exports.editEmployeeSpecilization = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const employee = await Employee.findByPk(req.params.id);


        const specialization_arr = req.body.specialization;

        // console.log(specialization_arr);

        const specializations = [];

        //to add new
        for (let specialization in specialization_arr) {

            const found_specialization = await Specialization.findOne({
                where:
                    { name: specialization_arr[specialization] }
            });

            // console.log(found_specialization);

            specializations.push(found_specialization);

            const [spec, created] = await Employee_Specialization.findOrCreate({
                where: {
                    employeeId: employee.id,
                    specializationId: found_specialization.id
                },
                transaction: t
            });

        }


        //to remove 
        const emp_specs = await Employee_Specialization.findAll({
            where: {
                employeeId: employee.id
            }
        });

        const found_specializations = [];

        for (let s in emp_specs) {
            found_specializations.push(await Specialization.findByPk(emp_specs[s].specializationId));
        }


        for (let s in found_specializations) {
            let count = 0;

            for (let spec in specialization_arr) {
                if (specialization_arr[spec] == found_specializations[s].name) {
                    count++;
                }
            }

            // console.log(specialization_arr[spec],'====',count);

            if (count == 0) {

                const emp_spec = await Employee_Specialization.findAll({
                    where: {
                        employeeId: employee.id,
                        specializationId: emp_specs[s].specializationId
                    }
                });

                if (emp_spec.length > 0) {
                    emp_spec[0].destroy();
                }
                // console.log(emp_spec);
            }
        }


        await t.commit();

        res.status(200).json({message: 'Employee updated successfully' });

    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

exports.getAppointments = async (req, res) => {
    // const t=await sequelize.transaction();

    try {

        const id = req.query.employee;
        const salonId=req.params.id;

        console.log(id, salonId);
        
        const appointments=await Appointment.findAll({
            where:{
                employeeId:id,
                salonId:salonId
            }
        });

       
        res.status(200).json({ appointments:appointments });

    } catch (error) {
        // await t.rollback();
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}


