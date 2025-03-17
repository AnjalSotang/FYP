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
      level: {
          type: Sequelize.ENUM("Beginner", "Intermediate", "Advanced"),
          allowNull: false
      },
      duration: {
          type: Sequelize.STRING, // In minutes
          allowNull: false
      },
      category: {
        type: Sequelize.STRING,
      },
      calories: {
        type: Sequelize.STRING
      },
      is_featured:{
        type: Sequelize.STRING 
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
