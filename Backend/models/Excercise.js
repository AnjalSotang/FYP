module.exports = (sequelize, Sequelize) => {
    const Excercise = sequelize.define("Excercise", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true // Ensures name is not empty
            }
        },
        muscle_group: {
            type: Sequelize.JSON, // Store multiple muscle groups as JSON array
            allowNull: false
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
            type: Sequelize.TEXT, // Storing multiple equipment types in JSON format
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
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        duration: {
            type: Sequelize.INTEGER,
            validate: {
                min: 1
            }
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, { timestamps: true });

    return Excercise;
};
