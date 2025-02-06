const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Employee=sequelize.define('employee',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    start_date:{
        type:Sequelize.DATE,
        allowNull:false
    },
    end_date:{
        type:Sequelize.DATE
    }
});

module.exports=Employee;