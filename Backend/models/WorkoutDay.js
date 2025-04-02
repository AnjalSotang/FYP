module.exports = (sequelize, Sequelize) => {
    const WorkoutDay = sequelize.define("WorkoutDay", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          dayNumber: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          dayName: {
            type: Sequelize.STRING,
            allowNull: false
          }
    }, { timestamps: true });
  
    return WorkoutDay;
  };
  