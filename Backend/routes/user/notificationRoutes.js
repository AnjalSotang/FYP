const express = require("express");
const router = express.Router();
const notificationController = require("../../controller/user/notificationController");
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");

// Get all notifications for a user
router.get("/user/:userId/Notifications", checkTokenAndRole('user'), notificationController.getUserNotifications);

// Mark notification as read
router.patch(`/user/:userId/Notifications/:id/read`, checkTokenAndRole('user'), notificationController.markAsRead);

// Mark all notifications as read
router.patch("/user/:userId/Notifications/read-all", checkTokenAndRole('user'), notificationController.markAllAsRead);

// Delete notification
router.delete("/user/:userId/Notification/:id", checkTokenAndRole('user'), notificationController.deleteNotification);

// Get unread notification count
router.get("/user/:userId/unread-count", checkTokenAndRole('user'), notificationController.getUnreadCount);

module.exports = router;