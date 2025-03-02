const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Payment=sequelize.define('payment',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    paymentid:{
        type:Sequelize.STRING
    },
    orderid:{
        type:Sequelize.STRING,
        allowNull:false
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=Payment