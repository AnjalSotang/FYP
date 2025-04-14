// routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const settingsController = require('../../controller/admin/generalSettingController');
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");

// Get current settings
router.get('/admin/settings', checkTokenAndRole('admin'), settingsController.getSettings);

// Create new settings
router.post('/admin/settings', checkTokenAndRole('admin'), settingsController.createSettings);

// Update settings
router.put('/admin/settings', checkTokenAndRole('admin'), settingsController.updateSettings);

// Update default user role for existing users
router.patch('/admin/userSettings', checkTokenAndRole('admin'), settingsController.updateDefaultRolesForExistingUsers);

router.patch('/admin/maintainanceMode', checkTokenAndRole('admin'), settingsController.maintainceMode);



module.exports = router;
