const { Op, Sequelize } = require("sequelize");
const { workout, workoutExercise } = require('../../models/index');

const createWorkout = async (req, res) => {
  try {
    // 1️⃣ Get Workout Data from Request
    const { name, description, difficulty_level, duration, goal } = req.body;

    // Get file paths safely
    const imagePath = req.files?.image ? req.files.image[0].path : null;

    // Validation (Ensure required fields are present)
    if (!name || !description || !difficulty_level || !duration || !goal || imagePath === 0) {
      return res.status(400).json({ message: "Workout name, difficulty, and exercises are required." });
    }

    // Check if the exercise already exists
    const existingWorkout = await workout.findOne({ where: { name } });
    if (existingWorkout) {
      return res.status(409).json({ message: "Exercise already added" });
    }


    // 2️⃣ Create the Workout in DB
    const response = await workout.create({ name, description, difficulty_level, duration, goal, imagePath });

    // 4️⃣ Response
    res.status(201).json({ message: "Workout created successfully!", response });

  } catch (error) {
    res.status(500).json({ message: `Internal Server ${error.message}` });
    console.log(error)
  }
};

const addExerciseToWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { exerciseId, sets, reps, rest_time } = req.body;

    if (!workoutId || !exerciseId || !sets || !reps) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const response = await workoutExercise.create({
      workoutId,
      exerciseId,
      sets,
      reps,
      rest_time
    });

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add exercise to workout" });
  }
};


module.exports = {
  createWorkout,
  addExerciseToWorkout
}
