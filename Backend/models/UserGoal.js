module.exports = (sequelize, Sequelize) => {
    const userGoals = sequelize.define('userGoal', {
        startDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        endDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        currentWeight: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        targetAchieved: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        progressPercentage: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
        }
    })
    return userGoals;
}

