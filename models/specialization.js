const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Specialization = sequelize.define('specialization', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
});


// Insert predefined specializations when the table is created
Specialization.sync().then(async () => {
    const count = await Specialization.count();
    if (count === 0) { // Only insert if table is empty
        await Specialization.bulkCreate([
            { name: 'Hair Stylist' },
            { name: 'Barber' },
            { name: 'Beautician' },
            { name: 'Massage Therapist' },
            { name: 'Nail Technician' },
            { name: 'Epilation' },
            { name: 'Brow technician' },
            { name: 'Makeup Artist' },
            { name: 'Tattoo Artist' },
            { name: 'All Services Specialist' }, // Can do everything
        ]);
        console.log("Specializations added successfully!");
    }
});

module.exports = Specialization;