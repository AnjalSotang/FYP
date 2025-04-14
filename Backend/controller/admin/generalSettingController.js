// controllers/settingsController.js
const { Settings, users } = require('../../models');
const { createUserNotification } = require('../user/notificationController');

// Get the current settings (typically just one record)
exports.getSettings = async (req, res) => {
  try {
    // Usually we just get the first/only settings record
    const settings = await Settings.findOne({
      order: [['createdAt', 'DESC']] // Get the most recently created/updated
    });

    if (!settings) {
      // If no settings exist yet, return default values
      return res.status(200).json({
        platformName: 'FitTrack',
        supportEmail: 'support@example.com',
        description: 'A fitness tracking platform'
      });
    }

    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// Create new settings
exports.createSettings = async (req, res) => {
  try {
    const { platformName, supportEmail, description } = req.body;



    // Validate required fields
    if (!platformName || !supportEmail) {
      return res.status(400).json({ message: 'Platform name and support email are required' });
    }

    // Create new settings
    const settings = await Settings.create({
      platformName,
      supportEmail,
      description
    });

    return res.status(201).json(settings);
  } catch (error) {
    console.error('Error creating settings:', error);

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }

    return res.status(500).json({ message: 'Error creating settings', error: error.message });
  }
};

// Update existing settings
exports.updateSettings = async (req, res) => {
  try {
    const { platformName, supportEmail, description } = req.body;

    // Validate required fields
    if (!platformName || !supportEmail) {
      return res.status(400).json({ message: 'Platform name and support email are required' });
    }

    // Find existing settings, typically we just update the first/only record
    let settings = await Settings.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (!settings) {
      // If no settings exist yet, create instead of update
      settings = await Settings.create({
        platformName,
        supportEmail,
        description
      });
      return res.status(201).json(settings);
    }

    // Update existing settings
    settings = await settings.update({
      platformName,
      supportEmail,
      description
    });

    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }

    return res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};



exports.updateDefaultRolesForExistingUsers = async (req, res) => {
  try {
    const { defaultUserRole, allowRegistrations } = req.body;

    // Bug 1: 'Settings' should be singular (based on model naming conventions)
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // Store old values to check if defaultUserRole changed
    const oldDefaultUserRole = settings.defaultUserRole;
    const oldAllowRegistrations = settings.allowRegistrations;

    // Bug 2: update() method expects an object, not separate parameters
    await settings.update({
      defaultUserRole,
      allowRegistrations
    });

    // Notification for disabled registrations
    if (oldAllowRegistrations !== allowRegistrations) {

      // Notify regular users with relevant information
      const regularUsers = await users.findAll({ where: { role: 'user' } });
      for (const user of regularUsers) {
        await createUserNotification(
          user.id,
          "Platform Registration Update",
          "Public registration has been disabled. If you want to invite someone to join, please contact an administrator.",
          'registration_status',
          settings.id,
          'Settings'
        );
      }
    }





    // Check if defaultUserRole changed and if we should apply to existing users
    if (defaultUserRole &&
      defaultUserRole !== oldDefaultUserRole) {

      // Bug 3: 'users' should be 'User' (the model name)
      // Bug 4: Use defaultUserRole directly instead of req.body.defaultUserRole
      const [updatedCount] = await users.update(
        { role: defaultUserRole },
        { where: { role: oldDefaultUserRole } }
      );

      return res.status(200).json({
        message: `Settings updated successfully. ${updatedCount} existing users updated to role: ${defaultUserRole}`,
        // Bug 5: settings is already an instance, use findOne() on the model, not the instance
        settings: await Settings.findOne(),
        updatedUserCount: updatedCount
      });
    }

    // Return updated settings
    const updatedSettings = await Settings.findOne();
    res.status(200).json({
      message: 'Settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ message: 'Failed to update user settings', error: error.message });
  }
};


exports.checkRegistrationAllowed = async (req, res, next) => {
  try {
    const setting = await Settings.findOne();

    // If no settings exist or registrations are explicitly allowed
    if (!setting || setting.allowRegistrations === true) {
      return next();
    }

    // Registrations are disabled
    return res.status(403).json({
      message: 'User registrations are currently disabled by the administrator'
    });
  } catch (error) {
    console.error('Error checking registration settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update existing settings
exports.maintainceMode = async (req, res) => {
  try {
    const { maintenanceMode } = req.body;
    console.log(req.body);
    // Validate required fields
    if (maintenanceMode === undefined) {
      return res.status(400).json({ message: 'Maintenance mode is required' });
    }

    // Find existing settings, typically we just update the first/only record
    let settings = await Settings.findOne({
      order: [['createdAt', 'DESC']]
    });

    const oldMaintainenceMode = settings.maintenanceMode;

    // Update existing settings
    settings = await settings.update({
      maintenanceMode
    });

    // Notification for disabled registrations
    if (oldMaintainenceMode !== maintenanceMode) {
      // Notify regular users with relevant information
      const regularUsers = await users.findAll({ where: { role: 'user' } });
      for (const user of regularUsers) {
        await createUserNotification(
          user.id,
          "Maintenance Mode Update",
          "The platform is currently undergoing maintenance. Please check back later.",
          'maintenance_update',
          settings.id,
          'Settings'
        );
      }
    }



    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }

    return res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};


