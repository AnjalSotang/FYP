module.exports = (sequelize, DataTypes) => {
    const WorkoutDayExercise = sequelize.define("WorkoutDayExercise", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
        sets: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reps: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rest_time: {
            type: DataTypes.INTEGER, // in seconds
            allowNull: false
        }
    }, { timestamps: false });

    return WorkoutDayExercise;
};
