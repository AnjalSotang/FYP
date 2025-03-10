const { Workout, WorkoutExercise, Exercise } = require('../../models/index');

exports.createWorkout = async (req, res) => {
    try {
        // 1️⃣ Get Workout Data from Request
        const { name, description, difficulty_level, duration, goal, is_active, exercises } = req.body;

        // Validation (Ensure required fields are present)
        if (!name || !difficulty_level || !exercises || exercises.length === 0) {
            return res.status(400).json({ message: "Workout name, difficulty, and exercises are required." });
        }

        // 2️⃣ Create the Workout in DB
        const workout = await Workout.create({ name, description, difficulty_level, duration, goal, is_active });

        console.log('✅ Workout Created:', workout.name);

        // 3️⃣ Associate Exercises with Workout
        for (let i = 0; i < exercises.length; i++) {
            const exerciseData = exercises[i];

            // Check if Exercise exists
            const exerciseExists = await Exercise.findByPk(exerciseData.exercise_id);
            if (!exerciseExists) {
                return res.status(404).json({ message: `Exercise with ID ${exerciseData.exercise_id} not found` });
            }

            await WorkoutExercise.create({
                workout_id: workout.id,
                exercise_id: exerciseData.exercise_id,
                sets: exerciseData.sets,
                reps: exerciseData.reps,
                order: i + 1,  // Maintain order of exercises
                rest_time: exerciseData.rest_time
            });
        }

        console.log('✅ Exercises Linked to Workout Successfully.');

        // 4️⃣ Response
        res.status(201).json({ message: "Workout created successfully!", workout });

    } catch (error) {
        console.error("❌ Error creating workout:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
