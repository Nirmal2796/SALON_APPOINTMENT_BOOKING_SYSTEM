const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Notificaiton=sequelize.define('notificaiton',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    seen:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    },
    
},{
    timestamps:false
});

module.exports=Notificaiton;