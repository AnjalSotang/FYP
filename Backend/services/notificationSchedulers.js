const cron = require('node-cron');
const notificationController = require('../controller.js/notificationController');

// Schedule to run every 5 minutes
const setupNotificationScheduler = () => {
  console.log('🔔 Setting up notification scheduler');
  
  // Check for upcoming workouts every 5 minutes
  cron.schedule('* * * * *', async () => {
    console.log('Checking for upcoming workouts...');
    try {
      await notificationController.checkUpcomingWorkouts();
    } catch (error) {
      console.error('Error in worko ut notification scheduler:', error);
    }
  });
  
  // Check for achievements daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Checking for achievements...');
    try {
      // You would need to get all users and check achievements for each
      const db = require('../models');
      const users = await db.users.findAll();
      
      for (const user of users) {
        await notificationController.checkWorkoutAchievements(user.id);
      }
    } catch (error) {
      console.error('Error in achievement notification scheduler:', error);
    }
  });
};

module.exports = setupNotificationScheduler;