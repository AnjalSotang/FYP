const express = require("express");
const router = express.Router();
const notificationController = require("../controller.js/notificationController");
// const { checkTokenAndRole } = require("../middleware/checkTokenAndRole");

// Get all notifications for a user
router.get("/notifications/user/:userId", notificationController.getUserNotifications);

// Mark notification as read
router.patch("/notifications/:id/read", notificationController.markAsRead);

// Mark all notifications as read
router.patch("/notifications/user/:userId/read-all", notificationController.markAllAsRead);

// Delete notification
router.delete("/notifications/user/:id", notificationController.deleteNotification);

// Get unread notification count
router.get("/:userId/user/unread-count", notificationController.getUnreadCount);

module.exports = router;