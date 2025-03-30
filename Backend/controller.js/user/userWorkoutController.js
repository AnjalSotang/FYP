const { Op, Sequelize } = require("sequelize");
const {userWorkout, workout, users} = require('../../models/index');

const createUserWorkout = async (req, res) => {
  try {
    // Extract user ID from the decoded token
    let userId = req.decoded.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token." });
    }
    console.log("Decoded User ID:", userId);

    const userExists = await users.findOne({ where: { id: userId } });
    console.log("User Exists:", userExists); // Debugging
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }
    
    // Extract WorkoutId from request parameters
    const { WorkoutId } = req.params;
    console.log("WorkoutId from request:", WorkoutId);

    // Validate if the WorkoutId is provided
    if (!WorkoutId) {
      return res.status(400).json({ message: "Workout ID is required." });
    }

    // Check if the workout plan exists
    const workoutPlan = await workout.findOne({ where: { id: WorkoutId } });
    if (!workoutPlan) {
      return res.status(404).json({ message: "Workout not found." });
    }

    // Check if the user already has the workout in their plan
    const existingUserWorkout = await userWorkout.findOne({
      where: { userId, workoutId: WorkoutId },
    });
    if (existingUserWorkout) {
      return res.status(400).json({ message: "This workout has already been added to your plan." });
    }

    // Create a new UserWorkout record
    const newUserWorkout = await userWorkout.create({
      userId,
      workoutId: WorkoutId
    });

    // Respond with success message
    res.status(201).json({
      data: newUserWorkout,
      message: "Workout added successfully to your plan.",
    });
  } catch (error) {
    console.error("Error occurred while creating user workout:", error);

    // Return a generic error message if something unexpected happens
    res.status(500).json({
      message: "An unexpected error occurred while adding the workout.",
      error: error.message || "Unknown error",
    });
  }
};

  // Fetch UserWorkouts for a specific user
const getUserWorkouts = async () => {
  try {
        // Extract user ID from the decoded token
        let userId = req.decoded.id;
        if (!userId) {
          return res.status(400).json({ message: "User ID not found in token." });
        }
        console.log("Decoded User ID:", userId);
    // Fetch UserWorkout entries for the specified user
    const userWorkouts = await userWorkout.findAll({
      where: { userId }, // Filter by userId
      include: {
        model: workout, // Include the associated Workout model
        // attributes: ['id', 'name'], // Specify the fields to include from the Workout table
      },
    });

    // If no UserWorkouts found, return a friendly message
    if (userWorkouts.length === 0) {
      return res.status(400).json({ message: "Now workouts found for this user." });
    }

    // Return the UserWorkout data along with the associated Workout details
    // Respond with success message
    return res.status(200).json({
      data: userWorkouts,
      message: "Workout added successfully to your plan.",
    });
  } catch (error) {
    console.error('Error fetching UserWorkouts:', error);
    return res.status(500).json({ message: 'Failed to fetch workout plans' });  }
};


const deleteUserWorkout = async (req, res) => {
  try {
    // Extract user ID from the decoded token
    let userId = req.decoded.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token." });
    }
    console.log("Decoded User ID:", userId);

    // Extract WorkoutId from request parameters
    const { WorkoutId } = req.params;
    console.log("WorkoutId from request:", WorkoutId);

    // Validate if the WorkoutId is provided
    if (!WorkoutId) {
      return res.status(400).json({ message: "Workout ID is required." });
    }

    // Check if the user has the workout in their plan
    const existingUserWorkout = await userWorkout.findOne({
      where: { userId, workoutId: WorkoutId },
    });
    if (!existingUserWorkout) {
      return res.status(404).json({ message: "Workout not found in your plan." });
    }

    // Delete the UserWorkout record
    await userWorkout.destroy({
      where: { userId, workoutId: WorkoutId },
    });

    // Respond with success message
    res.status(200).json({
      message: "Workout removed successfully from your plan.",
    });
  } catch (error) {
    console.error("Error occurred while deleting user workout:", error);

    // Return a generic error message if something unexpected happens
    res.status(500).json({
      message: "An unexpected error occurred while removing the workout.",
      error: error.message || "Unknown error",
    });
  }
};



module.exports = {
  createUserWorkout,
    getUserWorkouts,
    deleteUserWorkout
};

