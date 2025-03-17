const { Op, Sequelize } = require("sequelize");
const { workout, workoutExcercise } = require('../../models/index');

const createWorkout = async (req, res) => {
  try {
    // 1️⃣ Get Workout Data from Request
    const { name, description, level, duration, category, calories, goal } = req.body;
    const image = req.file;  // Multer file upload

    // Validation (Ensure required fields are present)
    if (!name || !description || !level || !duration || !category || !calories|| !goal) {
      return res.status(400).json({ message: "Workout name, description, difficulty, duration, and goal are required." });
    }

    if (!image) {
      return res.status(400).json({ message: "Workout image is required." });
    }

    // Check if the workout already exists
    const existingWorkout = await workout.findOne({ where: { name } });
    if (existingWorkout) {
      return res.status(409).json({ message: "Workout already exists." });
    }

    // 2️⃣ Get file path (Multer stores files in the 'uploads/' folder by default)
    const imagePath = image.path;  // Path to the uploaded image

    // 3️⃣ Create the Workout in the DB
    const response = await workout.create({
      name,
      description,
      level,
      duration,
      category,
      calories,
      goal,
      imagePath,  // Save the file path to the database
    });

    // 4️⃣ Response
    res.status(201).json({
      message: "Workout created successfully!",
      data: response,
    });

  } catch (error) {
    console.error("Error creating workout:", error); // Detailed error logging
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

const addExerciseToWorkout = async (req, res) => {
  try {
    console.log(req.body)
        const { WorkoutId, ExcerciseId, sets, reps, rest_time  } = req.body;

    if (!WorkoutId || !ExcerciseId || !sets || !reps) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const response = await workoutExcercise.create({
      WorkoutId,
      ExcerciseId,
      sets,
      reps,
      rest_time
    });

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

const getAllWorkout = async (req, res) => {
    try {
        const response = await  workout.findAll({
            order: [['createdAt', 'DESC']], //
        })

        if (!response.length) {
            return res.status(404).json({ message: "No workout found" });
        }

        res.status(200).json({
            data: response
        })
    }
    catch (error) {
        console.error("Error fetching excercises:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message
        });
    }
}
const deleteWorkout = async (req, res) => {
  try {
      const { id } = req.params;

      // Find the workout to ensure it exists
      const workoutToDelete = await workout.findByPk(id);

      if (!workoutToDelete) {
          return res.status(404).json({ message: "Workout not found" });
      }

      // Proceed to delete the workout
      await workout.destroy({
          where: { id }
      });

      res.status(200).json({
          message: `${workoutToDelete.name} has been permanently deleted`
      });
  } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({
          message: "An internal server error occurred. Please try again later.",
      });
  }
};

const updateWorkout = async (req, res) => {
  try {
    console.log("Received Body:", req.body);
    console.log("ID Type:", typeof req.body.id);
    console.log("Uploaded File:", req.file);
    
    let {
      id,
      name,
      description,
      level,
      duration,
      category,
      calories,
      goal
    } = req.body;


    // Find workout by ID
    const workoutExist = await workout.findByPk(id);
    if (!workoutExist) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Handle image processing safely
    let imagePath = workoutExist.imagePath; // Default to existing path
    if (req.file) {
      imagePath = req.file.path; // Update only if new file exists
    }

    // Update only provided fields, fallback to existing data if not provided
    await workoutExist.update({
      name: name ?? workoutExist.name,
      description: description ?? workoutExist.description,
      level: level ?? workoutExist.level,
      duration: duration ?? workoutExist.duration,
      category: category ?? category.duration,
      calories: calories ?? calories.duration,
      goal: goal ?? workoutExist.goal,
      imagePath,  // Update image if new file is uploaded, else keep old value
    });

    // Response
    res.status(200).json({
      message: "Workout updated successfully",
      data: workoutExist,
    });

  } catch (error) {
    console.error("Error updating workout:", error);  // Detailed error logging
    res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
      error: error.message,
    });
  }
};

const searchWorkouts = async (req, res) => {
  try {
    let { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Normalize search input (remove spaces, convert to lowercase)
    const searchTerm = query.replace(/\s+/g, "").toLowerCase();

    const workouts = await workout.findAll({
      where: {
        is_active: true, // Assuming you have an 'is_active' field like in the exercise model
        [Op.or]: [
          Sequelize.where(Sequelize.fn("LOWER", Sequelize.fn("REPLACE", Sequelize.col("name"), " ", "")), {
            [Op.like]: `%${searchTerm}%`,
          }),
          Sequelize.where(Sequelize.fn("LOWER", Sequelize.fn("REPLACE", Sequelize.col("description"), " ", "")), {
            [Op.like]: `%${searchTerm}%`,
          }),
          Sequelize.where(Sequelize.fn("LOWER", Sequelize.fn("REPLACE", Sequelize.col("goal"), " ", "")), {
            [Op.like]: `%${searchTerm}%`,
          }),
          Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("difficulty_level")), {
            [Op.like]: `%${searchTerm}%`,
          }),
          Sequelize.where(Sequelize.fn("LOWER", Sequelize.fn("REPLACE", Sequelize.col("duration"), " ", "")), {
            [Op.like]: `%${searchTerm}%`,
          })
        ].filter(Boolean), // Remove null values
      },
      order: [["createdAt", "DESC"]],
    });

    if (!workouts.length) {
      return res.status(404).json({ message: "No matching workouts found" });
    }

    res.status(200).json({ data: workouts });
  } catch (error) {
    console.error("Error searching workouts:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const getWorkout = async (req, res) => {
    try {
        let { id } = req.params;

        // Fetch the exercise by ID
        const response = await workout.findOne({ where: { id } });

        if (!response) {
            return res.status(404).json({ message: "No workout found" });
        }

        res.status(200).json({
            data: response
        })
    }
    catch (error) {
        console.error("Error during fetching excercies:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message

        });
    }
}


module.exports = {
  createWorkout,
  addExerciseToWorkout,
  getAllWorkout,
  deleteWorkout,
  updateWorkout,
  searchWorkouts,
  getWorkout
}
