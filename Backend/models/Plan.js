module.exports = (sequelize, Sequelize) => {
    const plan = sequelize.define('Plan', {
        plan_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
        },
        duration: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        type: {
            type: Sequelize.STRING,
        },
        intensity_level: {
            type: Sequelize.ENUM('Low', 'Medium', 'High'),
            allowNull: false,
        },
    });
    return plan
}