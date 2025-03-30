module.exports = (sequelize, Sequelize) => {
    const WorkoutSchedule = sequelize.define("WorkoutSchedule", {
      id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
        scheduledDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
          },
          scheduledTime: {
            type: Sequelize.TIME,
            allowNull: false
          },
          reminderEnabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
          },
          status: {
            type: Sequelize.ENUM('scheduled', 'completed', 'missed'),
            allowNull: false,
            defaultValue: 'scheduled'
          },
          notes: {
            type: Sequelize.TEXT,
            allowNull: true
          },
    }, { timestamps: true });

    return WorkoutSchedule;
};
