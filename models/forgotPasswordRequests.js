const Sequelize=require('sequelize');

const sequelize=require('../util/database');

// const { v4: uuidv4 } = require('uuid');

const ForgotPasswordRequests=sequelize.define('forgotpasswordrequest',{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    isActive:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    }
});

module.exports=ForgotPasswordRequests;