module.exports = (sequelize, Sequelize) => {
    const Goal = sequelize.define('Goal', {
        goal_name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          goal_type: {
            type: Sequelize.ENUM('Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility'),
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
          },
          duration: {
            type: Sequelize.STRING,
            allowNull: false,
          }
    });
    return Goal;
}