module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        // Define profile model fields here, for example:
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING,
        },
        gender: {
            type: Sequelize.ENUM('Male', 'Female', 'Other')
        },
        age: {
            type: Sequelize.INTEGER
        },
        height_feet: {
            type: Sequelize.INTEGER
        },
        height_inches: {
            type: Sequelize.INTEGER
        },
        weight: {
            type: Sequelize.FLOAT,
        },
        fitness_level: {
            type: Sequelize.ENUM('Beginner', 'Intermediate', 'Advanced')
        },
        otp: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        otpExpire: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        // role: {
        //     type: Sequelize.STRING,
        //     defaultValue: "user",
        //     allowNull: false,
        // }
    });

    return User;
}

