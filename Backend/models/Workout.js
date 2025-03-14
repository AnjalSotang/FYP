module.exports = (sequelize, Sequelize) => {
  const Workout = sequelize.define("Workout", {
      name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
      },
      description: {
          type: Sequelize.TEXT
      },
      difficulty_level: {
          type: Sequelize.ENUM("Beginner", "Intermediate", "Advance"),
          allowNull: false
      },
      duration: {
          type: Sequelize.STRING, // In minutes
          allowNull: false
      },
      goal: {
          type: Sequelize.STRING
      },
      imagePath: {
        type: Sequelize.STRING
    },
      is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
      }
  }, { timestamps: true });

  return Workout;
};
