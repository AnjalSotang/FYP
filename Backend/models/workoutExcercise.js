module.exports = (sequelize, DataTypes) => {
    const WorkoutExercise = sequelize.define("WorkoutExercise", {
        sets: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reps: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rest_time: {
            type: DataTypes.INTEGER, // in seconds
            allowNull: false
        }
    }, { timestamps: false });

    return WorkoutExercise;
};
