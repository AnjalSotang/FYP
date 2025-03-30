module.exports = (sequelize, Sequelize) => {
    const UserWorkout = sequelize.define("UserWorkout", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
        progress: {
            type: Sequelize.FLOAT, // percentage
            defaultValue: 0,
          },
          currentDay: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
          },
          startDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          completedWorkouts: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          streak: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          totalWorkouts: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          lastCompletedDate: {
            type: Sequelize.DATE,
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          }
    }, { timestamps: true });

    return UserWorkout;
};
