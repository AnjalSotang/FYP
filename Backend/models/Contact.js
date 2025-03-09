module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define('Contact', {
        // Define profile model fields here, for example:
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        subject: {
            type: Sequelize.STRING,
        },
        message: {
            type: Sequelize.STRING
        },
    });

    return Contact;
}