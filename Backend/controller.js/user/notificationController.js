// userNotificationController.js
const db = require("../../models");
const Notification = db.notification;
const WorkoutSchedule = db.workoutSchedule;
const UserWorkout = db.userWorkout;
const { Op } = require("sequelize");
const socketService = require('../../services/socketService');

// Create user notification service
const createUserNotification = async (userId, title, message, type = 'system', relatedId = null, relatedType = null) => {
  try {
    console.log(`Creating user notification for user ${userId}`);
    const notification = await Notification.create({
      UserId: userId,
      title,
      message,
      type,
      relatedId,
      relatedType,
      audience: 'user',
      read: false
    });

    // Get the io instance from the socket service
    const io = socketService.getIO();

    // Format notification with time ago for immediate display
    const formattedNotification = {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      audience: notification.audience,
      read: notification.read,
      time: 'Just now',
      relatedId: notification.relatedId,
      relatedType: notification.relatedType,
      createdAt: notification.createdAt
    };

    // Emit to specific user's room
    io.to(`user-${userId}`).emit('new-notification', formattedNotification);

    return notification;
  } catch (error) {
    console.error('Error creating user notification:', error);
    throw error;
  }
};

// Get all notifications for a user with pagination
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.findAll({
      where: { 
        UserId: userId,
        audience: 'user' // Only get user notifications
      },
      order: [['createdAt', 'DESC']], // Sorting notifications by creation time in descending order
    });

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
        audience: notification.audience,
        read: notification.read,
        time: timeAgo,
        relatedId: notification.relatedId,
        relatedType: notification.relatedType,
        createdAt: notification.createdAt,
      };
    });

    console.log(`Found ${formattedNotifications.length} notifications for user ${userId}`);
    // Send response with notifications
    res.status(200).json({
      notifications: formattedNotifications
    });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.params.userId; // Added user ID to ensure they can only mark their own notifications

    await Notification.update({ read: true }, {
      where: { 
        id: notificationId,
        UserId: userId,
        audience: 'user'
      }
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
      where: { 
        UserId: userId, 
        read: false,
        audience: 'user'
      }
    });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark all notifications as read", error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.params.id;


    await Notification.destroy({
      where: { 
        UserId: userId,
        audience: 'user'
      }
    });

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error.message);
    res.status(500).json({ message: "Failed to delete notification", error: error.message });
  }
};

// Delete all notifications for a user
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    await Notification.destroy({
      where: { 
        UserId: userId,
        audience: 'user'
      }
    });

    res.json({ message: "All notifications deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notifications", error: error.message });
  }
};

// Check upcoming workouts and send notifications
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

    // Create notifications for each upcoming workout
    for (const work of upcomingWorkouts) {
      console.log(`🔎 Checking workout ID: ${work.id} for UserID: ${work.UserId}`);

      const existingNotification = await Notification.findOne({
        where: {
          UserId: work.UserId,
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
        console.log(`✅ Creating notification for UserID: ${work.UserId} | Message: ${message}`);

        await createUserNotification(
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

    // First find all userWorkouts associated with the user
    const userWorkouts = await UserWorkout.findAll({
      where: { userId: userId }
    });

    if (userWorkouts.length === 0) {
      console.log(`No workout history found for user ID: ${userId}`);
      return { message: "No workout history found for this user." };
    }

    const userWorkoutIds = userWorkouts.map(workout => workout.id);

    const completedWorkouts = await db.userWorkoutHistory.count({
      where: {
        UserWorkoutId: {
          [Op.in]: userWorkoutIds
        },
        completed: true,
        updatedAt: {
          [Op.gte]: oneWeekAgo
        }
      }
    });

    console.log(`User ${userId} has completed ${completedWorkouts} workouts this week`);

    // Create achievement notifications based on milestones
    if (completedWorkouts === 5) {
      await createUserNotification(
        userId,
        "Achievement Unlocked",
        "You've completed 5 workouts this week! Great job staying consistent!",
        'achievement',
        null,
        'Achievement'
      );
    } else if (completedWorkouts === 10) {
      await createUserNotification(
        userId,
        "Achievement Unlocked",
        "10 workouts completed this week! You're on fire!",
        'achievement',
        null,
        'Achievement'
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
        UserId: userId,
        read: false,
        audience: 'user'
      }
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to get unread count", error: error.message });
  }
};

// Export the create notification function for use in other controllers
exports.createUserNotification = createUserNotification;