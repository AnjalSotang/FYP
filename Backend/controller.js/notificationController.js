const db = require("../models");
const Notification = db.notification;
const WorkoutSchedule = db.workoutSchedule;
const User = db.users;
const UserWorkout = db.userWorkout;
const WorkoutDay = db.workoutDay;
const Workout = db.workout;
const { Op } = require("sequelize");
const socketService = require('../services/socketService');

// Create notification service
const createNotification = async (userId, title, message, type = 'system', relatedId = null, relatedType = null) => {
  try {
    console.log(userId)
    const notification = await Notification.create({
    UserId: userId,
      title,
      message,
      type,
      relatedId,
      relatedType,
      read: false
    });

    // Get the io instance from the socket service
    const io = socketService.getIO();
    
    // Format notification with time ago for immediate display
    const now = new Date();
    const timeAgo = 'Just now';
    
    const formattedNotification = {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      time: timeAgo,
      relatedId: notification.relatedId,
      relatedType: notification.relatedType,
      createdAt: notification.createdAt
    };
    
    // Emit to specific user's room
    io.to(`user-${userId}`).emit('new-notification', formattedNotification);
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get all notifications for a user
// Get all notifications for a user with pagination
exports.getUserNotifications = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Retrieve page and limit from query params, with defaults
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit; // Calculate the offset for pagination
  
      // Fetch notifications for the user with pagination
      const notifications = await Notification.findAll({
        where: { UserId: userId },
        limit: parseInt(limit),
        offset: offset,
        order: [['createdAt', 'DESC']], // Sorting notifications by creation time in descending order
      });
  
      // Get total count of notifications for pagination info
      const totalNotifications = await Notification.count({
        where: { UserId: userId },
      });
  
      // Calculate total number of pages
      const totalPages = Math.ceil(totalNotifications / limit);
  
      // Format notifications with time ago
      const formattedNotifications = notifications.map(notification => {
        const now = new Date();
        const createdAt = new Date(notification.createdAt);
        const diff = Math.floor((now - createdAt) / 1000); // difference in seconds
  
        let timeAgo;
        if (diff < 60) {
          timeAgo = 'Just now';
        } else if (diff < 3600) {
          timeAgo = `${Math.floor(diff / 60)} minutes ago`;
        } else if (diff < 86400) {
          timeAgo = `${Math.floor(diff / 3600)} hours ago`;
        } else if (diff < 604800) {
          timeAgo = `${Math.floor(diff / 86400)} days ago`;
        } else {
          timeAgo = createdAt.toLocaleDateString();
        }
  
        return {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          read: notification.read,
          time: timeAgo,
          relatedId: notification.relatedId,
          relatedType: notification.relatedType,
          createdAt: notification.createdAt,
        };
      });
      
      console.log(formattedNotifications.length)
      // Send response with paginated notifications and pagination info
      res.status(200).json({
        notifications: formattedNotifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalNotifications,
        },
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
    }
  };
  

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    
    await Notification.update({ read: true }, {
      where: { id: notificationId }
    });
    
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    await Notification.update({ read: true }, {
      where: { userId, read: false }
    });
    
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark all notifications as read", error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    
    await Notification.destroy({
      where: { id: notificationId }
    });
    
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification", error: error.message });
  }
};

exports.checkUpcomingWorkouts = async () => {
    try {
      const now = new Date();
      const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000);
      
      // Format dates for database comparison
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().split(' ')[0];
      const thirtyMinLaterTime = thirtyMinutesLater.toTimeString().split(' ')[0];
  
      console.log('🕒 Current Time:', currentTime);
      console.log('🕒 30 Minutes Later:', thirtyMinLaterTime);
      console.log('📅 Today:', today);
  
        // Find scheduled workouts that are coming up in the next 30 minutes
        const upcomingWorkouts = await WorkoutSchedule.findAll({
          where: {
            scheduledDate: today,
            scheduledTime: {
              [Op.between]: [currentTime, thirtyMinLaterTime]
            },
            reminderEnabled: true,
            status: 'scheduled'
          },
          include: [
            { 
              model: db.userWorkout 
            },
            {
              model: db.workoutday,
              attributes: ['id', 'dayName'],
              include: [
                {
                  model: db.workout,
                  attributes: ['id', 'name']
                }
              ]
            }
          ]
        });
    
        console.log(`📌 Found ${upcomingWorkouts.length} upcoming workouts in next 30 mins`);
    
        // Rest of your code...
  
      // console.log(`📌 Found ${upcomingWorkouts.length} upcoming workouts in next 30 mins`);
  
      // Create notifications for each upcoming workout
      for (const work of upcomingWorkouts) {
        console.log(`🔎 Checking workout ID: ${work.id} for UserID: ${work.UserId}`);
  
        const existingNotification = await Notification.findOne({
          where: {
            userId: work.UserId,
            relatedId: work.id,
            relatedType: 'WorkoutSchedule',
            type: 'workout_reminder'
          }
        });
  
        if (existingNotification) {
          console.log(`⚠️ Notification already exists for workout ID: ${work.id}, skipping...`);
        } else {
          const scheduledTime = new Date(`${work.scheduledDate}T${work.scheduledTime}`);
          const formattedTime = scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const workoutName = work.WorkoutDay && work.WorkoutDay.Workout && work.WorkoutDay.Workout.name
          ? work.WorkoutDay.Workout.name 
          : (work.Workoutday && work.WorkoutDay.dayName 
               ? `Workout for Day ${work.WorkoutDay.dayName}` 
               : 'Workout');
               
        const dayName = work.WorkoutDay && work.WorkoutDay.dayName
          ? work.WorkoutDay.dayName
          : 'Workout';
          
  
          const message = `${workoutName} - ${dayName} is scheduled for today at ${formattedTime}.`;
          console.log(message)
          console.log(`✅ Creating notification for UserID: ${work.UserId} | Message: ${message}`);
  
          await createNotification(
            work.UserId,
            "Workout Reminder",
            message,
            'workout_reminder',
            work.id,
            'WorkoutSchedule'
          );
        }
      }
  
      console.log('🎉 Finished processing upcoming workout notifications');
      return { message: "Notifications created for upcoming workouts" };
  
    } catch (error) {
      console.error("❌ Error checking upcoming workouts:", error);
      throw error;
    }
  };
  

// Achievement notifications
exports.checkWorkoutAchievements = async (userId) => {
  try {
    // Count completed workouts in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const completedWorkouts = await WorkoutSchedule.count({
      where: {
        userId,
        status: 'completed',
        updatedAt: {
          [Op.gte]: oneWeekAgo
        }
      }
    });
    
    // Create achievement notifications based on milestones
    if (completedWorkouts === 5) {
      await createNotification(
        userId,
        "Achievement Unlocked",
        "You've completed 5 workouts this week! Great job staying consistent!",
        'achievement'
      );
    } else if (completedWorkouts === 10) {
      await createNotification(
        userId,
        "Achievement Unlocked",
        "10 workouts completed this week! You're on fire!",
        'achievement'
      );
    }
    
    return { message: "Achievement notifications checked" };
  } catch (error) {
    console.error("Error checking workout achievements:", error);
    throw error;
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const count = await Notification.count({
      where: { 
        userId,
        read: false
      }
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to get unread count", error: error.message });
  }
};

// Export the create notification function for use in other controllers
exports.createNotification = createNotification;