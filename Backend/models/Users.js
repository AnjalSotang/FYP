module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
          username: {
            type: Sequelize.STRING,
            unique: true,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true,
            },
          },
          bio:{
            type: Sequelize.TEXT
          },
          profileVisibility: {
            type: Sequelize.ENUM("public", "private"),
            defaultValue: "public",
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          firstName: {
            type: Sequelize.STRING,
          },
          lastName: {
            type: Sequelize.STRING,
          },
          profileImage: {
            type: Sequelize.STRING,
          },
          role: {
            type: Sequelize.ENUM("user", "admin"),
            defaultValue: "user",
          },
          heightFeet: {
            type: Sequelize.INTEGER,
          },
          heightInches: {
            type: Sequelize.INTEGER,
          },
          weight: {
            type: Sequelize.FLOAT,
          },
          fitnessGoal: {
            type: Sequelize.ENUM("weight_loss", "muscle_gain", "endurance", "strength", "flexibility", "general_fitness"),
            defaultValue: "general_fitness",
          },
          experienceLevel: {
            type: Sequelize.ENUM("beginner", "intermediate", "advanced"),
            defaultValue: "beginner",
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          },
          lastLogin: {
            type: Sequelize.DATE,
          },
        otp: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        otpExpire: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        age:{
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        gender:{
            type: Sequelize.ENUM("male", "female", "other"),
            allowNull: true,
        }
    });

    return User;
}

