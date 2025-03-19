const { workoutday, excercise, workoutdayExcercise }= require('../../models/index') 

// Create a new workout day
const createWorkoutDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayName } = req.body;
    if (!dayName || dayName.trim() === '') {
      return res.status(400).json({ error: 'Day name is required' });
    }

    // Ensure workoutId is not undefined
    console.log("Workout ID: ", id); // Log to verify the workoutId


    console.log(id)
    
    const workoutDay = await workoutday.create({ 
      dayName,
      WorkoutId: id
    });
    
    return res.status(201).json(workoutDay);
  } catch (error) {
    console.error('Error creating workout day:', error);
    return res.status(500).json({ error: 'Failed to create workout day' });
  }
};

// Get workout day by ID
const getWorkoutDayById = async (req, res) => {
  try {
    const { id } = req.params;
    const workoutDay = await workoutday.findByPk(id, {
      include: [
        {
          model: excercise,
          as: 'excercises',
          through: {
            attributes: ['sets', 'reps', 'rest_time']
          }
        }
      ]
    });
    
    if (!workoutDay) {
      return res.status(404).json({ error: 'Workout day not found' });
    }
    
    return res.status(200).json(workoutDay);
  } catch (error) {
    console.error('Error fetching workout day:', error);
    return res.status(500).json({ error: 'Failed to fetch workout day' });
  }
};

// Update workout day
const updateWorkoutDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayName } = req.body;

    console.log(id, dayName)
    
    if (!dayName || dayName.trim() === '') {
      return res.status(400).json({ error: 'Day name is required' });
    }
  

    const updatedWorkoutDay = await workoutday.update(
      { dayName },
      { where: { id } }
  );

  if (updatedWorkoutDay[0] === 0) {
      return res.status(404).json({ message: "Workout Day not found" });
  }

  const updatedData = await workoutday.findByPk(id);
 
    return res.status(200).json(updatedData);
  } catch (error) {
    console.error('Error updating workout day:', error);
    return res.status(500).json({ error: 'Failed to update workout day' });
  }
};

// Delete workout day
const deleteWorkoutDay = async (req, res) => {
  try {
    const { id } = req.params;
    const workoutDay = await workoutDay.findByPk(id);
    
    if (!workoutDay) {
      return res.status(404).json({ error: 'Workout day not found' });
    }
    
    await workoutDay.destroy();
    return res.status(200).json({ message: 'Workout day deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout day:', error);
    return res.status(500).json({ error: 'Failed to delete workout day' });
  }
};

// Add exercise to workout day
const addExerciseToWorkoutDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { excerciseId, sets, reps } = req.body;
    
    if (!excerciseId) {
      return res.status(400).json({ error: 'Exercise ID is required' });
    }
    
    if (!sets || sets < 1) {
      return res.status(400).json({ error: 'Sets must be at least 1' });
    }
    
    if (!reps || reps < 1) {
      return res.status(400).json({ error: 'Reps must be at least 1' });
    }
    
    const workoutDay = await workoutday.findByPk(id);
    if (!workoutDay) {
      return res.status(404).json({ error: 'Workout day not found' });
    }
    
    const exercise = await excercise.findByPk(excerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    // Check if exercise is already added to this day
    const existingExercise = await workoutdayExcercise.findOne({
      where: {
        workoutDayId: id,
        excerciseId
      }
    });
    
    if (existingExercise) {
      return res.status(409).json({ error: 'Exercise is already added to this workout day' });
    }
    
    const workoutDayExercise = await workoutdayExcercise.create({
      workoutDayId: parseInt(id),
      exerciseId: parseInt(excerciseId),
      sets,
      reps
    });
    
    // Return the exercise with the junction table data
    const result = {
      ...exercise.toJSON(),
      WorkoutDayExercise: workoutDayExercise
    };
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error adding exercise to workout day:', error);
    return res.status(500).json({ error: 'Failed to add exercise to workout day' });
  }
};

// Remove exercise from workout day
const removeExerciseFromWorkoutDay = async (req, res) => {
  try {
    const { id, excerciseId } = req.params;
    
    const workoutDayExercise = await workoutdayExcercise.findOne({
      where: {
        workoutDayId: id,
        excerciseId
      }
    });
    
    if (!workoutDayExercise) {
      return res.status(404).json({ error: 'Exercise not found in this workout day' });
    }
    
    await workoutdayExcercise.destroy();
    return res.status(200).json({ message: 'Exercise removed from workout day successfully' });
  } catch (error) {
    console.error('Error removing exercise from workout day:', error);
    return res.status(500).json({ error: 'Failed to remove exercise from workout day' });
  }
};

// Update exercise in workout day
const updateExerciseInWorkoutDay = async (req, res) => {
  try {
    const { id, excerciseId } = req.params;
    const { sets, reps } = req.body;
    
    if (!sets || sets < 1) {
      return res.status(400).json({ error: 'Sets must be at least 1' });
    }
    
    if (!reps || reps < 1) {
      return res.status(400).json({ error: 'Reps must be at least 1' });
    }
    
    const workoutDayExercise = await workoutdayExcercise.findOne({
      where: {
        workoutDayId: id,
        excerciseId
      }
    });
    
    if (!workoutDayExercise) {
      return res.status(404).json({ error: 'Exercise not found in this workout day' });
    }
    
    workoutdayExcercise.sets = sets;
    workoutdayExcercise.reps = reps;
    await workoutdayExcercise.save();
    
    return res.status(200).json(workoutDayExercise);
  } catch (error) {
    console.error('Error updating exercise in workout day:', error);
    return res.status(500).json({ error: 'Failed to update exercise in workout day' });
  }
};

module.exports = {
  createWorkoutDay,
  getWorkoutDayById,
  updateWorkoutDay,
  deleteWorkoutDay,
  addExerciseToWorkoutDay,
  removeExerciseFromWorkoutDay,
  updateExerciseInWorkoutDay
};