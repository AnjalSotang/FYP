const { userRecords, workout, users } = require('../../models/index');
const { Op } = require('sequelize');
// First, import the notification controller at the top of your file
const { createNotification } = require('./notificationController');

const createUserRecords = async (req, res) => {
  try {
    // Extract user ID from the decoded token
    const userId = req.decoded.id;
    const { excercise, value, unit, type } = req.body;


    // Check if userId exists
    if (!userId) {w
      return res.status(400).json({ message: "User ID not found in token." });
    }

    console.log("Decoded User ID:", userId);

    // Check if the user exists in the database
    const userExists = await users.findOne({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate the input data (exercise, value, unit, and type)
    if (!excercise || !value || !unit || !type) {
      return res.status(400).json({ message: "Missing required fields: exercise, value, unit, or type." });
    }

    // Check if the user already has a record with the same exercise
    const existingRecord = await userRecords.findOne({
      where: {
        UserId: userId,
        excercise,//Ensure this exercise is not duplicated for the user
      },
    });

    if (existingRecord) {
      return res.status(409).json({
        message: `Record for exercise "${excercise}" already exists for this user.`,
      });
    }

    // Create the personal record in the database
    const newRecord = await userRecords.create({
      excercise: excercise,
      value,
      unit,
      type,
      UserId: userId, // Associate the record with the user
    });

    return res.status(201).json({
      message: "Personal record created successfully.",
      data: newRecord,
    }); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while creating the personal record." });
  }
};

const updateUserRecords = async (req, res) => {
  try {
    const userId = req.decoded.id;
    const records = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token." });
    }

    const userExists = await users.findOne({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "No records provided." });
    }

    const updatedRecords = [];

    for (const record of records) {
      const { excercise, value, unit, type } = record;

      if (!excercise || (!value && value !== 0) || !unit || !type) {
        continue; // Skip invalid entries
      }

      const existingRecord = await userRecords.findOne({
        where: {
          userId,
          excercise,
        },
      });

      if (existingRecord) {
        const updated = await existingRecord.update({
          value,
          unit,
          type,
        });
        updatedRecords.push(updated);

        // Add notification for each updated record
        await createNotification(
          userId,
          "Personal Record",
          `Congratulations! You've set a new personal record for ${excercise}: ${value} ${unit}`,
          'achievement',
          updated.id,
          'Updated Personal Record'
        );
      }
    }

    return res.status(200).json({
      message: "Personal records updated successfully.",
      data: updatedRecords,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while updating the personal records." });
  }
};


const findAllUserRecords = async (req, res) => {
  try {
    // Extract user ID from the decoded token
    const userId = req.decoded.id;

    // Check if userId exists
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token." });
    }

    console.log("Decoded User ID:", userId);

    // Check if the user exists in the database
    const userExists = await users.findOne({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch all personal records for the user, with pagination
    const records = await userRecords.findAll({
      where: { UserId: userId },
      order: [['createdAt', 'DESC']], // Order by creation date, newest first
    });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No records found for this user." });
    }

    // Return the records with pagination info
    return res.status(200).json({
      data: records
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching the personal records." });
  }
};


const deleteUserRecord = async (req, res) => {
  try {
    // Extract user ID from the decoded token
    let userId = req.decoded.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token." });
    }
    console.log("Decoded User ID:", userId);

    // Extract WorkoutId from request parameters
    const { recordId } = req.params;


    // Validate if the WorkoutId is provided
    if (!recordId) {
      return res.status(400).json({ message: "User Record Id is required." });
    }

    // Check if the user has the workout in their plan
    const existingUserWorkout = await userRecords.findOne({
      where: { userId, id: recordId },
    });


    if (!existingUserWorkout) {
      return res.status(404).json({ message: "User Record not found." });
    }

    // Delete the UserWorkout record
    // await userWorkout.destroy({
    //   where: { userId, workoutId: WorkoutId },
    // });

    await userRecords.destroy({
      where: { id: recordId },
    });

    // Respond with success message
    res.status(200).json({
      message: "Record removed successfully.",
    });
  } catch (error) {
    console.error("Error occurred while deleting user workout:", error);

    // Return a generic error message if something unexpected happens
    res.status(500).json({
      message: "An unexpected error occurred while removing the record.",
      error: error.message || "Unknown error",
    });
  }
};




module.exports = {
  createUserRecords,
  updateUserRecords,
  findAllUserRecords,
  deleteUserRecord
};
