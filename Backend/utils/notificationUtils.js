
const formatNotification = (notification) => {
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
      userId: notification.UserId
    };
  };
  
const generateNotificationMessage = (eventType, data) => {
    switch (eventType) {
      case 'workout_reminder':
        const scheduledTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`);
        const formattedTime = scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          title: "Workout Reminder",
          message: `${data.workoutName} is scheduled for today at ${formattedTime}.`
        };
  
      case 'achievement':
        return {
          title: "Achievement Unlocked",
          message: `You've completed ${data.count} workouts this week! ${data.count >= 10 ? "You're on fire!" : "Great job staying consistent!"}`
        };
  
      case 'new_user':
        return {
          title: "New User Registration",
          message: `New user registered: ${data.firstName} ${data.lastName} (${data.email})`
        };
  
      case 'system_stats':
        return {
          title: "Daily Workout Stats",
          message: `Today's workout stats: ${data.completedCount} workouts completed by ${data.userCount} users.`
        };
  
      default:
        return {
          title: "Notification",
          message: "You have a new notification."
        };
    }
  };

module.exports = {
    formatNotification,
    generateNotificationMessage
  };