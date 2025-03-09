module.exports = (sequelize, DataTypes) => {
  const Workout = sequelize.define("Workout", {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      description: {
          type: DataTypes.TEXT
      },
      difficulty_level: {
          type: DataTypes.ENUM("Beginner", "Intermediate", "Advance"),
          allowNull: false
      },
      duration: {
          type: DataTypes.INTEGER, // In minutes
          allowNull: false
      },
      goal: {
          type: DataTypes.STRING
      },
      is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
      }
  }, { timestamps: true });

  return Workout;
};
