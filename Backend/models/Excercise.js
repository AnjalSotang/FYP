module.exports = (sequelize, Sequelize) => {
    const Exercise = sequelize.define("Exercise", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        muscle_group: {
            type: Sequelize.ARRAY(Sequelize.STRING), // Changed to an array of strings
            allowNull: false
        },
        secondary_muscle_group: {
            type: Sequelize.ARRAY(Sequelize.STRING), // Allowing secondary muscle groups too
            defaultValue: []
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
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: ["Bodyweight"]
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
            type: Sequelize.INTEGER
        },
        duration: {
            type: Sequelize.STRING
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, { timestamps: true });
    return Exercise;
};
