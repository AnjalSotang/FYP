const express = require("express");
const router = express.Router();
const notificationController = require("../../controller/admin/adminNotificationController");
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");

// Get all notifications for a user
router.get("/admin/notifications",checkTokenAndRole('admin'), notificationController.getAdminNotifications);

// Mark all notifications as read
router.patch("/admin/notifications/:id/read", checkTokenAndRole('admin'), notificationController.markAsRead);

// Mark all notifications as read
router.patch("/admin/notifications/read-all", checkTokenAndRole('admin'), notificationController.markAllAsRead);

// Delete notification
router.delete("/admin/notifications/:id", checkTokenAndRole('admin'), notificationController.deleteNotification);

// Get unread notification count
router.get("/admin/notifications/unread-count", checkTokenAndRole('admin'), notificationController.getUnreadCount);

module.exports = router;