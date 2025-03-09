module.exports = (sequelize, Sequelize) => {
    const Exercise = sequelize.define("Exercise", {
        // id: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     autoIncrement: true
        // },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        muscle_group: {
            type: Sequelize.STRING,
            allowNull: false
        },
        difficulty_level: {
            type: Sequelize.ENUM("Beginner", "Intermediate", "Advance"),
            allowNull: false
        },
        instructions: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        equipment: {
            type: Sequelize.STRING,
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
