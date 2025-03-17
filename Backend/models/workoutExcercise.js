module.exports = (sequelize, DataTypes) => {
    const WorkoutExercise = sequelize.define("WorkoutExercise", {
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

    return WorkoutExercise;
};
