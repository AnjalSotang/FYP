const { Op, Sequelize } = require("sequelize");
const { excercise } = require('../../models/index')

const addExcercise = async (req, res) => {
    try {
        // Destructure the necessary fields from the request body
        const {
            name,
            muscle_group,
            secondary_muscle_group,
            difficulty_level,
            instructions,
            category,
            burned_calories,
            duration
        } = req.body;

        // Get file paths safely
        const imagePath = req.files?.image ? req.files.image[0].path : null;
        const videoPath = req.files?.video ? req.files.video[0].path : null;
        const equipmentPaths = req.files?.equipment ? req.files.equipment.map(file => file.path) : [];

        console.log(req.body);
        console.log(req.files);


        // Check if any required fields are missing
        if (!name || !muscle_group || !difficulty_level || !instructions || !category || !burned_calories || !duration || equipmentPaths.length === 0) {
            return res.status(400).json({ message: "Fill up the form properly!!" });
        }

        // Check if the exercise already exists
        const existingExercise = await excercise.findOne({ where: { name } });
        if (existingExercise) {
            return res.status(409).json({ message: "Exercise already added" });
        }

        // Save to database (example using Sequelize)
        await excercise.create({
            name,
            muscle_group,
            secondary_muscle_group,
            difficulty_level,
            instructions,
            equipment: equipmentPaths.join(","), // Store as comma-separated string
            category,
            videoPath,
            imagePath,
            burned_calories: burned_calories ? parseInt(burned_calories) : null,
            duration: duration ? parseInt(duration) : null,
            is_active: true
        });

        return res.status(201).json({ message: "Exercise added successfully" });

    } catch (error) {
        console.error("Error adding exercise:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getAllExcercises = async (req, res) => {
    try {
        const response = await excercise.findAll({
            where: { is_active: true },
            order: [['createdAt', 'DESC']], //
        })

        if (!response.length) {
            return res.status(404).json({ message: "No exercises found" });
        }

        res.status(200).json({
            data: response
        });

    }
    catch (error) {
        console.error("Error fetching excercises:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message
        });
    }
}


const searchExercises = async (req, res) => {
    try {
        let { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }   

      // Normalize search input (remove spaces, convert to lowercase)
      const searchTerm = query.replace(/\s+/g, "").toLowerCase();

      const exercises = await excercise.findAll({
          where: {
              is_active: true,
              [Op.or]: [
                  Sequelize.where(Sequelize.fn("LOWER", Sequelize.fn("REPLACE", Sequelize.col("name"), " ", "")), {
                      [Op.like]: `%${searchTerm}%`,
                  }),
                  Sequelize.where(Sequelize.fn("LOWER", Sequelize.fn("REPLACE", Sequelize.col("muscle_group"), " ", "")), {
                      [Op.like]: `%${searchTerm}%`,
                  }),
                  Sequelize.where(Sequelize.fn("LOWER", Sequelize.fn("REPLACE", Sequelize.col("secondary_muscle_group"), " ", "")), {
                      [Op.like]: `%${searchTerm}%`,
                  }),
                  Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("difficulty_level")), {
                      [Op.like]: `%${searchTerm}%`,
                  }),
                  Sequelize.where(Sequelize.fn("LOWER", Sequelize.fn("REPLACE", Sequelize.col("equipment"), " ", "")), {
                      [Op.like]: `%${searchTerm}%`,
                  }),
                  Sequelize.where(Sequelize.fn("LOWER", Sequelize.fn("REPLACE", Sequelize.col("category"), " ", "")), {
                      [Op.like]: `%${searchTerm}%`,
                  }),
                  !isNaN(searchTerm) ? { burned_calories: parseInt(searchTerm) } : null
              ].filter(Boolean), // Remove null values
          },
          order: [["createdAt", "DESC"]],
      });


        if (!exercises.length) {
            return res.status(404).json({ message: "No matching exercises found" });
        }


        res.status(200).json({ data: exercises });
    } catch (error) {
        console.error("Error searching exercises:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getAllExcercisesForAdmin = async (req, res) => {
    try {
        const response = await excercise.findAll({
            order: [['createdAt', 'DESC']], //
        })

        if (!response.length) {
            return res.status(404).json({ message: "No exercises found" });
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

const getExcercise = async (req, res) => {
    try {
        let { id } = req.params;

        // Fetch the exercise by ID
        const response = await excercise.findOne({ where: { id } });

        if (!response) {
            return res.status(404).json({ message: "No exercises found" });
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

const updateExcercise = async (req, res) => {

    try {
        const { id } = req.params;
        const {
            name,
            muscle_group,
            secondary_muscle_group,
            difficulty_level,
            instructions,
            category,
            burned_calories,
            duration
        } = req.body;

        

        // Get file paths safely (if new files are uploaded)
        const imagePath = req.files?.image ? req.files.image[0].path : null;
        const videoPath = req.files?.video ? req.files.video[0].path : null;
        const equipmentPaths = req.files?.equipment ? req.files.equipment.map(file => file.path) : null;

        // Find exercise by ID
        const exercise = await excercise.findByPk(id);

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }


        // Update only provided fields
        await excercise.update({
            name: name || exercise.name,
            muscle_group: muscle_group || exercise.muscle_group,
            secondary_muscle_group: secondary_muscle_group || exercise.secondary_muscle_group,
            difficulty_level: difficulty_level || exercise.difficulty_level,
            instructions: instructions || exercise.instructions,
            category: category || exercise.category,
            burned_calories: burned_calories ? parseInt(burned_calories) : exercise.burned_calories,
            duration: duration ? parseInt(duration) : exercise.duration,
            imagePath: imagePath || exercise.imagePath,
            videoPath: videoPath || exercise.videoPath,
            equipment: equipmentPaths ? equipmentPaths.join(",") : exercise.equipment
        },
            { where: { id } });

        res.status(200).json({ message: "Exercise updated successfully", data: exercise });

    } catch (error) {
        console.error("Error updating exercise:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message
        });
    }
};

const toggleExerciseActive = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body; // Get the new isActive status from request body

        // Find the exercise
        const exercise = await excercise.findByPk(id);

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        // Update the is_active field
        await exercise.update({ is_active: isActive }, { where: {id}});

        res.status(200).json({
            message: `Exercise has been ${isActive ? "activated" : "deactivated"}`,
            data: exercise, // Send updated exercise data
        });
    } catch (error) {
        console.error("Error updating exercise status:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message,
        });
    }
};



const deleteExcercise = async (req, res) => {
    try {
        let { id } = req.params;

        // Find the exercise first
        const exercise = await excercise.findByPk(id);

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        await excercise.destroy({
            where: {
                id
            }
        })

        res.status(200).json({
            message: `${exercise.name} has been permanently deleted`
        })
    }
    catch (error) {
        console.error("Error deleting excercise:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
        });
    }
}


module.exports = {
    addExcercise,
    getAllExcercises,
    getAllExcercisesForAdmin,
    getExcercise,
    deleteExcercise,
    updateExcercise,
    toggleExerciseActive,
    searchExercises
}