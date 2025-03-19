module.exports = (sequelize, Sequelize) => {
    const WorkoutDay = sequelize.define("WorkoutDay", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          dayName: {
            type: Sequelize.STRING,
            allowNull: false
          }
    }, { timestamps: true });
  
    return WorkoutDay;
  };
  