// adminNotificationController.js
const db = require("../../models");
const Notification = db.notification;
const User = db.users;
const { Op } = require("sequelize");
const socketService = require('../../services/socketService');
const { formatDateTime } = require("../../helpers/formatDateAndTime");

// Create admin notification service
const createAdminNotification = async (title, message, type = 'admin-alert', relatedId = null, relatedType = null) => {
  try {
    console.log('Creating admin notification');
    const notification = await Notification.create({
      UserId: null, // Null for system-wide admin notifications
      title,
      message,
      type,
      relatedId,
      relatedType,
      audience: 'admin',
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

    // Emit only to admin channel
    io.to('admin-channel').emit('admin-notification', formattedNotification);

    return notification;
  } catch (error) {
    console.error('Error creating admin notification:', error);
    throw error;
  }
};

// Get all admin notifications
exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { audience: 'admin' },
      order: [['createdAt', 'DESC']], // Sorting notifications by creation time in descending order
    });

    const formattedNotifications = notifications.map(notification => {
      const { time, date } = formatDateTime(notification.createdAt);

      return {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        audience: notification.audience,
        read: notification.read,
        time, // e.g., "9:30 AM"
        date, // e.g., "Today"
        relatedId: notification.relatedId,
        relatedType: notification.relatedType,
        createdAt: notification.createdAt,
        userId: notification.UserId
      };
    });

    console.log(`Found ${formattedNotifications.length} admin notifications`);

    res.status(200).json({
      notifications: formattedNotifications
    });
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    res.status(500).json({ message: "Failed to fetch admin notifications", error: error.message });
  }
};

// Mark admin notification as read
exports.markAsRead = async (req, res) => {
  try {
    const {id} = req.params;
    console.log(id)
    console.log('Marking admin notification as read:', id);

    await Notification.update({ read: true }, {
      where: { 
        id,
        UserId: null,
        audience: 'admin'
      }
    });

    res.status(200).json({ message: "Admin notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
  }
};

// Mark all admin notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update({ read: true }, {
      where: { 
        audience: 'admin',
        read: false,
      }
    });

    res.status(200).json({ message: "All admin notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark all notifications as read", error: error.message });
  }
};

// Delete admin notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const whereClause = { 
      id: notificationId,
      audience: 'admin'
    };


    await Notification.destroy({ where: whereClause });

    res.json({ message: "Admin notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification", error: error.message });
  }
};

// Generate system notifications about new registrations
exports.notifyNewUserRegistration = async (newUser) => {
  try {
    if (!newUser || !newUser.id) {
      console.error("Invalid user data for notification");
      return null;
    }

    // Create admin notification about new user registration
    const message = `New user registered: ${newUser.firstName} (${newUser.email})`;
    
    await createAdminNotification(
      "New User Registration",
      message,
      'user_registration',
      newUser.id,
      'User'
    );

    return { message: "Admin notification created for new user registration" };
  } catch (error) {
    console.error("Error creating new user registration notification:", error);
    throw error;
  }
};

// Notification for workout completions (system overview)
exports.notifyWorkoutCompletionStats = async () => {
  try {
    // Get workout completion stats for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completedCount = await db.userWorkoutHistory.count({
      where: {
        completed: true,
        updatedAt: {
          [Op.gte]: today
        }
      }
    });
    
    const userCount = await db.userWorkoutHistory.count({
      distinct: true,
      col: 'UserId',
      where: {
        completed: true,
        updatedAt: {
          [Op.gte]: today
        }
      }
    });

    const message = `Today's workout stats: ${completedCount} workouts completed by ${userCount} users.`;
    
    await createAdminNotification(
      "Daily Workout Stats",
      message,
      'system_stats',
      null,
      'Stats'
    );

    return { message: "Admin notification created for workout stats" };
  } catch (error) {
    console.error("Error creating workout stats notification:", error);
    throw error;
  }
};

// Notify admin about new user workout creation
exports.notifyUserWorkoutCreation = async (userId, workoutId, workoutName) => {
  try {
    if (!userId || !workoutId) {
      console.error("Invalid workout data for notification");
      return null;
    }

    // Get user information
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email']
    });

    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      return null;
    }

    // Create admin notification about new workout creation
    const message = `User ${user.username} (${user.email}) has added "${workoutName}" workout to their plan`;
    
    await createAdminNotification(
      "New Workout Plan Added",
      message,
      'user_workout_creation',
      workoutId,
      'Workout'
    );

    return { message: "Admin notification created for new workout creation" };
  } catch (error) {
    console.error("Error creating new workout notification:", error);
    throw error;
  }
};

// Notify admin about new workout creation
exports.notifyNewWorkoutCreation = async (workoutData) => {
  try {
    if (!workoutData || !workoutData.id || !workoutData.name) {
      console.error("Invalid workout data for notification");
      return null;
    }

    // Create admin notification about new workout creation
    const message = `New workout plan created: "${workoutData.name}" (${workoutData.level} level, ${workoutData.duration})`;
    
    await createAdminNotification(
      "New Workout Plan Created",
      message,
      'workout_creation',
      workoutData.id,
      'Workout'
    );

    return { message: "Admin notification created for new workout creation" };
  } catch (error) {
    console.error("Error creating new workout notification:", error);
    throw error;
  }
};

// Notify admin about user account deletion
exports.notifyUserAccountDeletion = async (userInfo) => {
  try {
    if (!userInfo || !userInfo.id || !userInfo.email) {
      console.error("Invalid user data for deletion notification");
      return null;
    }

    // Create admin notification about account deletion
    const message = `User account deleted: ${userInfo.username || 'Unknown'} (${userInfo.email})`;
    
    await createAdminNotification(
      "Account Deleted",
      message,
      'account_deletion',
      userInfo.id,
      'User'
    );

    return { message: "Admin notification created for account deletion" };
  } catch (error) {
    console.error("Error creating account deletion notification:", error);
    throw error;
  }
};

// Notify admin about workout completion
exports.notifyWorkoutCompletion = async (completionData) => {
  try {
    if (!completionData || !completionData.userId || !completionData.workoutName) {
      console.error("Invalid workout completion data for notification");
      return null;
    }

    // Format date for display
    const completedDateFormatted = new Date(completionData.completedDate).toLocaleDateString();

    // Create admin notification about workout completion
    const message = `User ${completionData.username} (${completionData.email}) has completed the "${completionData.workoutName}" workout program on ${completedDateFormatted}`;
    
    await createAdminNotification(
      "Workout Program Completed",
      message,
      'workout_completion',
      completionData.workoutId,
      'Workout'
    );

    return { message: "Admin notification created for workout completion" };
  } catch (error) {
    console.error("Error creating workout completion notification:", error);
    throw error;
  }
};

// Add this to your adminNotificationController.js
exports.notifyWorkoutRemoval = async (data) => {
  try {
    if (!data || !data.userId || !data.workoutName) {
      console.error("Invalid data for workout removal notification");
      return null;
    }

    // Create admin notification about workout removal
    const message = `User ${data.username} (${data.email}) has removed workout plan "${data.workoutName}" from their plans.`;
    
    await createAdminNotification(
      "Workout Plan Removed By User",
      message,
      'workout_removed',
      data.workoutId,
      'Workout'
    );

    return { message: "Admin notification created for workout removal" };
  } catch (error) {
    console.error("Error creating workout removal notification:", error);
    throw error;
  }
};
// Get unread admin notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        audience: 'admin',
        read: false,
      }
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to get unread count", error: error.message });
  }
};

// Export notification functions for use in other controllers
exports.createAdminNotification = createAdminNotification;
// exports.createTargetedAdminNotification = createTargetedAdminNotification;