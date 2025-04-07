const { userMeasurements, users } = require('../../models/index');
const { Op } = require('sequelize');

const createUserMeasuremetRecords =  async (req, res) => {
  try {
    // Extract user ID from the decoded token
    const userId = req.decoded.id;
    const {date, weight, bodyFat, chest, waist, hips, arms, shoulders, thighs } = req.body;


    // Check if userId exists
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token." });
    }

    // console.log("Decoded User ID:", userId);

    // Check if the user exists in the database
    const userExists = await users.findOne({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate the input data (exercise, value, unit, and type)
    if (!date, !weight, !bodyFat, !chest, !waist, !hips, !arms, !shoulders, !thighs ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newRecord = await userMeasurements.create({
        date,
        weight,
        bodyFat,
        chest,
        waist,
        hips,
        arms,
        shoulders,
        thighs,
        UserId: userId,
      });

      return res.status(201).json({
        message: "Body measurement record created successfully.",
        data: newRecord,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while creating the body measurements record." });
  }
};

const updateUserMeasurementRecord = async (req, res) => {
    try {
      const userId = req.decoded.id;
      const measurementId = req.params.id;

      const {
        date,
        weight,
        bodyFat,
        chest,
        waist,
        hips,
        arms,
        shoulders,
        thighs,
      } = req.body;
  
      // Check if userId exists
      if (!userId) {
        return res.status(400).json({ message: "User ID not found in token." });
      }
  
      // Check if the user exists
      const userExists = await users.findOne({ where: { id: userId } });
      if (!userExists) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Check if the measurement record exists and belongs to the user
      const existingRecord = await userMeasurements.findOne({
        where: {
          UserId: userId,
          id: measurementId,
        },
      });
  
      if (!existingRecord) {
        return res.status(404).json({ message: "Measurement record not found." });
      }
  
      // Update the measurement record
      await existingRecord.update({
        date,
        weight,
        bodyFat,
        chest,
        waist,
        hips,
        arms,
        shoulders,
        thighs,
      });
  
      return res.status(200).json({
        message: "Measurement record updated successfully.",
        data: existingRecord,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the body measurements record." });
    }
  };

  const getAllUserMeasurementRecords = async (req, res) => {
    try {
      const userId = req.decoded.id;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID not found in token." });
      }
  
      const records = await userMeasurements.findAll({
        where: { UserId: userId },
        order: [['date', 'DESC']],
      });
  
      return res.status(200).json({
        message: "User measurement records fetched successfully.",
        data: records,
      });
    } catch (error) {
      console.error("Fetch error:", error);
      return res.status(500).json({ message: "Something went wrong while fetching records." });
    }
  };
  
  

  const deleteUserMeasurementRecord = async (req, res) => {
    try {
      const userId = req.decoded.id;
      const measurementId = req.params.id;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID not found in token." });
      }
  
      // Check if the record exists and belongs to the user
      const record = await userMeasurements.findOne({
        where: { id: measurementId, UserId: userId },
      });
  
      if (!record) {
        return res.status(404).json({ message: "Measurement record not found or doesn't belong to the user." });
      }
  
      await record.destroy();
  
      return res.status(200).json({ message: "Measurement record deleted successfully." });
    } catch (error) {
      console.error("Delete error:", error);
      return res.status(500).json({ message: "Something went wrong while deleting the record." });
    }
  };
  
  



module.exports = {
  createUserMeasuremetRecords,
  updateUserMeasurementRecord,
  getAllUserMeasurementRecords,
  deleteUserMeasurementRecord
};
