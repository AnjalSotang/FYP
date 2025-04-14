module.exports = (sequelize, Sequelize) => {
  const Settings = sequelize.define('Setting', {
    platformName: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'FitTrack'
    },
    supportEmail: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      defaultValue: 'support@example.com'
    },
    description: {
      type: Sequelize.TEXT,
      defaultValue: 'A fitness tracking platform'
    },
    allowRegistrations: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    defaultUserRole: {
      type: Sequelize.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    maintenanceMode: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  return Settings;
};