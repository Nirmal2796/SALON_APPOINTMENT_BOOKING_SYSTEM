const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Employee_Specialization=sequelize.define('employee_specialization',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
});

module.exports=Employee_Specialization;