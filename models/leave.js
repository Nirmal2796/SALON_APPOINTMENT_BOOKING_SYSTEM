const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Leave=sequelize.define('leave',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    },
    start_date:{
        type:Sequelize.DATE,
        allowNull:false
    },
    end_date:{
        type:Sequelize.DATE,
        allowNull:false
    }
});

module.exports=Leave;