const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Regular_Shift=sequelize.define('regular_shift',{
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

module.exports=Regular_Shift;