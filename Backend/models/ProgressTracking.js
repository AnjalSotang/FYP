module.exports = (sequelize, Sequelize) => {
    const ProgressTracking = sequelize.define('ProgressTracking', {
      weightProgress: {
        type: Sequelize.FLOAT,
      },
      progressDate: {
        type: Sequelize.DATE,
      },
      repsImprovement: {
        type: Sequelize.INTEGER
      },
      workoutStreak: {
        type: Sequelize.INTEGER,
      },
      caloriesBurned: {
        type: Sequelize.INTEGER,
      }
    });
  
    return ProgressTracking;
  };
  