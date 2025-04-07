module.exports = (sequelize, Sequelize) => {
    const PersonalRecords = sequelize.define("PersonalRecord", {
        excercise: {
            type: Sequelize.TEXT, // Store multiple muscle groups as JSON array
            allowNull: false,
        },
        value: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        unit: {
            type: Sequelize.STRING,
            allowNull: false,   
            defaultValue: 'lbs'
        },
        type: {
            type: Sequelize.STRING, // Storing multiple equipment types in JSON format
        }
    })

    return PersonalRecords;
};
