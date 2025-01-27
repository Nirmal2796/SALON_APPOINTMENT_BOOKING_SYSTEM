const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Working_Hours=sequelize.define('working_hours',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    day:{
        type:Sequelize.STRING,
        allowNull:false
    },
    start_time:{
        type:Sequelize.TIME,
        allowNull:false
    },
    end_time:{
        type:Sequelize.TIME,
        allowNull:false
    }
});

module.exports=Working_Hours;