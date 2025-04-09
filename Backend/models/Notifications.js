module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("Notification", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        // allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        // allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        // allowNull: false,
        defaultValue: 'system'
      },
      read: {
        type: Sequelize.BOOLEAN,
        // allowNull: false,
        defaultValue: false // Default to false, as notifications are usually unread
      },
      relatedId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "ID of related item (workout schedule, achievement, etc.)"
      },
      relatedType: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Type of related item (WorkoutSchedule, etc.)"
      }
    }, { timestamps: true });
  
    return Notification;
  };