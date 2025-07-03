const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Review = sequelize.define('review', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    rate: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    feedback:{
        type:Sequelize.STRING
    },
    reply:{
        type:Sequelize.STRING
    }
});

module.exports = Review;