const express = require("express");
const router = express.Router();
const notificationController = require("../../controller.js/admin/adminNotificationController");
// const { checkTokenAndRole } = require("../middleware/checkTokenAndRole");

// Get all notifications for a user
router.get("/admin/notifications", notificationController.getAdminNotifications);

// Mark all notifications as read
router.patch("/admin/notifications/:id/read", notificationController.markAsRead);

// Mark all notifications as read
router.patch("/admin/notifications/read-all", notificationController.markAllAsRead);

// Delete notification
router.delete("/admin/notifications/:id", notificationController.deleteNotification);

// Get unread notification count
router.get("/admin/notifications/unread-count", notificationController.getUnreadCount);

module.exports = router;