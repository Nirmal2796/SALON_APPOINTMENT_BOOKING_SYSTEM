const sequelize = require('../util/database');
const Salon = require('../models/salon');
const Service = require('../models/service');
const Working_Hours = require('../models/working_hours');
const Closed_Period = require('../models/closed_period');
const Employee = require('../models/employee');
const Specialization = require('../models/specialization');
const Employee_Specialization = require('../models/employee_specialization');
const Appointment = require('../models/appointment');
const { Op } = require('sequelize');

exports.getSalons = async (req, res) => {
    try {

        const salons = await Salon.findAll();

        res.status(200).json({ salons: salons });


    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

exports.getSalon = async (req, res) => {
    try {

        const id = req.params.id;

        const salon = await Salon.findByPk(id);

        const services = await Service.findAll({
            where: {
                salonId: id
            }
        });

        for (let s in services) {

            const specialization = await Specialization.findByPk(services[s].specializationId);

            const service = services[s];

            services[s] = { service, specialization };

        }

        const working_hours = await Working_Hours.findAll({
            where: {
                salonId: id
            }
        });

        const employee = await Employee.findAll({
            where: {
                salonId: id
            }
        });

        res.status(200).json({ salon: { salon, services, working_hours, employee } });


    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

exports.getClosedPeriod = async (req, res) => {

    try {

        const id = req.params.id;

        const salon = await Salon.findByPk(id);

        const closedPeriod = await Closed_Period.findAll({
            where: {
                salonId: id
            }
        });

        res.status(200).json({ closedPeriod: closedPeriod });


    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

exports.getSpecialists = async (req, res) => {
    try {

        const id = req.params.id;

        const specialization = req.query.specialization;

        // console.log(specialization);

        // const salon = await Salon.findByPk(id);

        // console.log(salon);

        const employees = await Employee.findAll({
            where:
            {
                salonId: id
            }
        });

        // console.log(employees);

        // const found_specialization=await Specialization.findAll({
        //     where:{
        //         name:specialization
        //     }
        // });

        // console.log(found_specialization);


        const emp_spec = await Employee_Specialization.findAll({
            where: {
                specializationId: specialization
            }
        });

        // console.log(emp_spec);


        let employee = [];

        for (let es in emp_spec) {

            for (let e in employees) {

                if (emp_spec[es].employeeId == employees[e].id) {
                    employee.push(employees[e]);
                }
            }

        }



        res.status(200).json({ employee: employee });


    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}


exports.getServices = async (req, res) => {
    try {

        const id = req.params.id;

        const specialization = req.query.specialization;

        // console.log(specialization);

        const salon = await Salon.findByPk(id);


        // const found_specialization=await Specialization.findByPk(specialization);


        const services = await Service.findAll({
            where:
            {
                salonId: salon.id,
                specializationId: specialization
            }
        });



        res.status(200).json({ services: services });


    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

exports.getBookedAppointments = async (req, res) => {
    // const t=await sequelize.transaction();

    try {

        const salon_id = req.params.id;
        // Decode and parse the employees query parameter from the string to an actual array
        const employees = JSON.parse(decodeURIComponent(req.query.employees));

        // console.log(employees);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let appointments = [];
        let selectedEmployee=0;
        let randomArray=[];

        for (let e of employees) {

            // console.log('Employee >>>>', e);

            if (e.employeeId == '0') {
                //for Any professional
                const emps = await Employee_Specialization.findAll({
                    where: {
                        specializationId: e.specializationId
                    },
                    attributes: ['employeeId']
                });

                // to select random employee for auto assign
                const randomIndex = Math.floor(Math.random() * emps.length);
                selectedEmployee = emps[randomIndex].employeeId;

                // console.log('selectedEmployee >>> ', selectedEmployee)

                randomArray.push({
                    selectedEmployee,
                    specializationId:e.specializationId
                })

                appointments.push(...await Appointment.findAll({
                    where: {
                        salonId: salon_id,
                        employeeId: selectedEmployee,
                        date: {
                            [Op.gte]: today // Only today and future
                        }
                    },
                    attributes: ['employeeId', 'date', 'start_time', 'end_time']
                }));

                // console.log('Appointments of selected employee >>>>' , appointments)

            }
            else {
                // for selected professional
                appointments.push(...await Appointment.findAll({
                    where: {
                        salonId: salon_id,
                        employeeId: e.employeeId,
                        date: {
                            [Op.gte]: today // Only today and future
                        }
                    },
                    attributes: ['employeeId', 'date', 'start_time', 'end_time']
                }));
            }

        }


        const working_hours = await Working_Hours.findAll({
            where: {
                salonId: salon_id
            }
        });


        res.status(200).json({ message: 'success', selectedEmployee: randomArray, appointments: appointments, working_hours: working_hours});


    } catch (error) {
        // await t.rollback();
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}