const { excercise } = require('../models/index')

const addExcercise = async (req, res) => {

    try {
        const { name, muscle_group, difficultyLevel, instructions, equipment, category, burned_calories, duration } = req.body;

        // Handle image file
        const image = req.files?.find(file => file.fieldname === 'image'); // Find the image file in req.files
        const imagePath = image ? image.path : null; // Path of the uploaded image

        // Handle video file
        const video = req.files?.find(file => file.fieldname === 'video'); // Find the video file in req.files
        const videoPath = video ? video.path : null; // Path of the uploaded video

        // Check if any required fields are missing
        if (!name || !muscle_group || !difficultyLevel || !instructions || !equipment || !category || !burned_calories || !duration || !videoPath || !imagePath) {
            return res.status(400).json({ message: "Fill up the form properly!!" });
        }

        // Check if the exercise already exists
        const existingExcercise = await excercise.findOne({ where: { name } });
        if (existingExcercise) {
            return res.status(409).json({ message: "Excercise already added" });
        }

        // Create a new exercise
        await excercise.create({
            name,
            muscle_group,
            difficultyLevel,
            instructions,
            equipment,
            category,
            videoPath,
            imagePath,
            burned_calories,
            duration
        });
        
        // Respond with success message
        res.status(201).json({
            message: `${name} exercise added successfully!!`
        });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
        });
    }
}


const getAllExcercises = async (req, res) => {
    try {
        const response = await excercise.findAll({ where: { is_active: true } })
        res.status(200).json({
            data: response
        })
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
        });
    }
}

const getAllExcercisesForAdmin = async (req, res) => {
    try {
        const response = await excercise.findAll()
        res.status(200).json({
            data: response
        })
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
        });
    }
}

const getExcercise = async (req, res) => {
    try {
        let { id } = req.params;

        const response = await excercise.findByPk(id)
        res.status(200).json({
            data: response
        })
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
        });
    }
}

const updateExcercise = async (req, res) => {
    
    try {
        const {id} = req.params;
        const { name, muscle_group, difficultyLevel, instructions, equipment, category, burned_calories, duration } = req.body;

        // Handle image file
        const image = req.files?.find(file => file.fieldname === 'image'); // Find the image file in req.files
        const imagePath = image ? image.path : null; // Path of the uploaded image

        // Handle video file
        const video = req.files?.find(file => file.fieldname === 'video'); // Find the video file in req.files
        const videoPath = video ? video.path : null; // Path of the uploaded video

        // Check if any required fields are missing
        if (!name || !muscle_group || !difficultyLevel || !instructions || !equipment || !category || !burned_calories || !duration || !videoPath || !imagePath) {
            return res.status(400).json({ message: "Fill up the form properly!!" });
        }

        // Create a new exercise
        await excercise.update({
            name,
            muscle_group,
            difficultyLevel,
            instructions,
            equipment,
            category,
            videoPath,
            imagePath,
            burned_calories,
            duration
        },{where: {
            id
        }});

        // Respond with success message
        res.status(201).json({
            message: `${name} exercise added successfully!!`
        });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({
            message: error
        });
    }
}

const deactiveExercise = async (req, res) => {
    const {id} = req.params;
    const response = await excercise.update({ is_active: false }, { where: { id } });
    res.status(200).json({
        message: `${response.name} deactivated`
    })
}


const activeExercise = async (req, res) => {
    const {id} = req.params;
    const response = await excercise.update({ is_active: true }, { where: { id } });
    res.status(200).json({
        message: `${response.name} deactivated`
    })
}


const deleteExcercise = async (req, res) => {
    try{
        let { id } = req.params;
        const response = await excercise.destroy({
            where: {
                id
            }
        })
        res.status(200).json({
            data: response
        })
    }
    catch (error) {
        console.error("Error during registration:", error);
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
    activeExercise,
    deactiveExercise
}