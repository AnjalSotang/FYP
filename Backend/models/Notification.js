module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define('Notification', {
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
    return Notification
    }