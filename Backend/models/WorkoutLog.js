module.exports = (sequelize, Sequelize) => {
    const WorkoutLog = sequelize.define('WorkoutLog', {
      sets: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reps: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      weight_lifted: {
        type: Sequelize.FLOAT,
      },
      duration: {
        type: Sequelize.INTEGER, // in minutes
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    });

    return WorkoutLog;
  };