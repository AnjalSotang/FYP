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
          type: Sequelize.ENUM("All","Beginner", "Intermediate", "Advanced"),
          allowNull: false
      },
      duration: {
          type: Sequelize.STRING, 
          allowNull: false
      },
      goal: {
          type: Sequelize.STRING
      },
      role: {
          type: Sequelize.STRING
      },
      equipment: {
          type: Sequelize.TEXT
      },
      calories:{
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
