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
    // Specialization.drop();
    if (count === 0) { // Only insert if table is empty
        await Specialization.bulkCreate([
            { name: 'Hair & Styling' },
            { name: 'Nails' },
            { name: 'Facial' },
            { name: 'Massage' },
            { name: 'Barbering' },
            { name: 'Hair Removal' },
            { name: 'Makeup' },
            { name: 'Eyebrows and Eyelashes' },
            { name: 'Tattoo and Piercing' },
            { name: 'All Services Specialist' }, // Can do everything
        ]);
        console.log("Specializations added successfully!");
    }
});

module.exports = Specialization;