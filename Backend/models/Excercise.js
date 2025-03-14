module.exports = (sequelize, Sequelize) => {
    const Exercise = sequelize.define("Exercise", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        muscle_group: {
            type: Sequelize.TEXT, // Storing as a JSON string or comma-separated values
            allowNull: false
        },
        secondary_muscle_group: {
            type: Sequelize.TEXT, // Allowing secondary muscle groups too
            defaultValue: "Back"
        },
        difficulty_level: {
            type: Sequelize.ENUM("Beginner", "Intermediate", "Advanced"),
            allowNull: false
        },
        instructions: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        equipment: {
            type: Sequelize.TEXT, // Changed to TEXT to store as JSON or comma-separated values
            defaultValue: "Bodyweight"
        },
        category: {
            type: Sequelize.STRING
        },
        videoPath: {
            type: Sequelize.STRING
        },
        imagePath: {
            type: Sequelize.STRING
        },
        burned_calories: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        duration: {
            type: Sequelize.INTEGER,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, { timestamps: true });

    return Exercise;
};
