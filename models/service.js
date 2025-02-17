const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Service=sequelize.define('service',{
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
    description:{
        type:Sequelize.STRING,
        allowNull:false
    },
    duration:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    price:{
        type:Sequelize.INTEGER,
        allowNull:false,
        // autoIncrement:false,
    }
});

module.exports=Service;