const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Appointment = sequelize.define('appointment', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    start_time: {
        type: Sequelize.TIME,
        allowNull: false
    },
    end_time: {
        type: Sequelize.TIME,
        allowNull: false
    },
    // isAutoAssigned:{
    //     type:Sequelize.BOOLEAN,
    //     allowNull:false
    // }
});

module.exports = Appointment;