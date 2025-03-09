module.exports = (sequelize, DataTypes) => {
    const WorkoutExercise = sequelize.define("WorkoutExercise", {
        workout_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Workouts',
                key: 'id'
            }
        },
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Exercises',
                key: 'id'
            }
        },
        sets: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reps: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        order: {
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
