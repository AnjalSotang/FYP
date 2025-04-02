const { workoutSchedule, userWorkout, workout, workoutday, users, excercise } = require('../../models/index');
const { Op } = require('sequelize');


exports.getAllWorkoutPlans = async (req, res) => {
  try {
    // const userId = req.decoded.id; // Assuming user is extracted from auth middleware

    const availableWorkoutPlans = await workout.findAll({
      include: [
        {
          model: workoutday,
          as: 'days',
          attributes: ['id', 'dayName']
        }
      ]
    });

    return res.status(200).json({
     data: availableWorkoutPlans
    });
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch workout plans',
      error: error.message
    });
  }
};





exports.getScheduledWorkouts = async (req, res) => {
  try {
    const userId =  req.decoded.id // Assuming user is extracted from auth middleware
    
    const scheduledWorkouts = await workoutSchedule.findAll({
      where: { userId },
      include: [
        {
          model: userWorkout,
        },
        {
          model: workoutday,
          attributes: ['id', 'dayName'],
          include: [
            {
              model: workout,
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['scheduledDate', 'ASC'], ['scheduledTime', 'ASC']]
    });

    console.log(JSON.stringify(scheduledWorkouts, null, 2));
    
// Format the response to match the front-end expected structure
const formattedWorkouts = scheduledWorkouts.map(workout => ({
  id: workout.id,
  workoutPlan: workout.WorkoutDay?.Workout?.name || "Unknown Workout",
  day: workout.WorkoutDay?.dayName || "Unknown Day",
  date: workout.scheduledDate,
  time: workout.scheduledTime,
  reminder: workout.reminderEnabled,
  status: workout.status
}));


    
    return res.status(200).json({
      success: true,
      data: formattedWorkouts
    });
  } catch (error) {
    console.error('Error fetching scheduled workouts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch scheduled workouts',
      error: error.message
    });
  }
};



exports.getWorkoutsForDate = async (req, res) => {
  try {
    const userId = req.decoded.id; // Assuming user is extracted from auth middleware
    const { formattedDate } = req.params;
    console.log("formattedDate", formattedDate)
    const scheduledWorkouts = await workoutSchedule.findAll({
      where: { 
        userId,
        scheduledDate: formattedDate
      },
      include: [
        {
          model: userWorkout,
        },
        {
          model: workoutday,
          attributes: ['id', 'dayName'],
          include: [
            {
              model: workout,
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['scheduledTime', 'ASC']]
    });


    const formattedWorkouts = scheduledWorkouts.map(workout => ({
      id: workout.id,
      workoutPlan: workout.WorkoutDay?.Workout?.name || "Unknown Workout",
      day: workout.WorkoutDay?.dayName || "Unknown Day",
      date: workout.scheduledDate,
      time: workout.scheduledTime,
      reminder: workout.reminderEnabled,
      status: workout.status
    }));
    
    
    return res.status(200).json({
      success: true,
      data: formattedWorkouts
    });
  } catch (error) {
    console.error('Error fetching workouts for date:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch workouts for date',
      error: error.message
    });
  }
};

exports.getUpcomingWorkouts = async (req, res) => {
  try {
    const userId = req.decoded.id; // Assuming user is extracted from auth middleware
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const upcomingWorkouts = await workoutSchedule.findAll({
      where: { 
        userId,
        scheduledDate: {
          [Op.gte]: today
        },
        status: 'scheduled'
      },
      include: [
        {
          model: userWorkout,
        },
        {
          model: workoutday,
          attributes: ['id', 'dayName'],
          include: [
            {
              model: workout,
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['scheduledDate', 'ASC'], ['scheduledTime', 'ASC']],
      limit: 5
    });
    
    // Format the response to match the front-end expected structure
    const formattedWorkouts = upcomingWorkouts.map(workout => ({
      id: workout.id,
      workoutPlan: workout.WorkoutDay.Workout.name,
      day: workout.WorkoutDay.dayName,
      date: workout.scheduledDate,
      time: workout.scheduledTime,
      reminder: workout.reminderEnabled
    }));
    
    return res.status(200).json({
      success: true,
      data: formattedWorkouts
    });
  } catch (error) {
    console.error('Error fetching upcoming workouts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming workouts',
      error: error.message
    });
  }
};

exports.scheduleWorkout = async (req, res) => {
  try {
    const userId = req.decoded.id; // Assuming user is extracted from auth middleware
    console.log("userId", userId)
    const { workoutPlanId, workoutDayId, scheduledDate, scheduledTime, reminderEnabled } = req.body;
    
    if(!userId){
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }


    // First check if the user has this workout plan active
    let UserWorkout = await userWorkout.findOne({
      where: {
        userId,
        workoutId: workoutPlanId
      }
    });
    

    if (!UserWorkout) {
      // If not found, create a new user workout association
      res.status(400).json({
        success: false,
        message: 'User does not have this workout plan'
      });
    }
    
    
    // Now schedule the workout  
    const newSchedule = await workoutSchedule.create({
      UserId: userId,
      UserWorkoutId: UserWorkout.id,
      WorkoutDayId: workoutDayId,
      scheduledDate,
      scheduledTime,
      reminderEnabled: reminderEnabled || true,
      status: 'scheduled'
    });
      
// Get the complete schedule details to return
const scheduleWithDetails = await workoutSchedule.findByPk(newSchedule.id, {
  include: [
    {
      model: userWorkout,
    },
    {
      model: workoutday,
      attributes: ['id', 'dayName'],
      include: [
        {
          model: workout,
          attributes: ['id', 'name']
        }
      ]
    }
  ]
});


// // Debug: log the data structure
// console.log(JSON.stringify(scheduleWithDetails, null, 2));
// Format the response based on the actual data structure
const formattedWorkout = {
  id: scheduleWithDetails.id,
  workoutPlan: scheduleWithDetails.WorkoutDay.Workout.name,
  day: scheduleWithDetails.WorkoutDay.dayName,
  date: scheduleWithDetails.scheduledDate,
  time: scheduleWithDetails.scheduledTime,
  reminder: scheduleWithDetails.reminderEnabled,
};

return res.status(201).json({
  success: true,
  message: 'Workout scheduled successfully',
  data: formattedWorkout
});


  } catch (error) {
    console.error('Error scheduling workout:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to schedule workout',
      error: error.message
    });
  }
};



exports.deleteScheduledWorkout = async (req, res) => {
  try {
    const userId = req.decoded.id; // Assuming user is extracted from auth middleware
    const { id } = req.params;
    
    const workout = await workoutSchedule.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Scheduled workout not found or not authorized'
      });
    }
    
    await workout.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Scheduled workout deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scheduled workout:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete scheduled workout',
      error: error.message
    });
  }
};

exports.updateWorkoutStatus = async (req, res) => {
  try {
    const userId = req.id; // Assuming user is extracted from auth middleware
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['scheduled', 'completed', 'missed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }
    
    const workout = await WorkoutSchedule.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Scheduled workout not found or not authorized'
      });
    }
    
    workout.status = status;
    await workout.save();
    
    // If workout is completed, update user workout progress
    if (status === 'completed') {
      const userWorkout = await UserWorkout.findByPk(workout.userWorkoutId);
      
      if (userWorkout) {
        // Get total days in the workout plan
        const totalDays = await WorkoutDay.count({
          where: { workoutPlanId: userWorkout.workoutPlanId }
        });
        
        // Count completed workouts for this user workout
        const completedWorkouts = await WorkoutSchedule.count({
          where: {
            userWorkoutId: userWorkout.id,
            status: 'completed'
          }
        });
        
        // Update progress
        userWorkout.progress = Math.min(100, (completedWorkouts / totalDays) * 100);
        
        // Update current day
        const workoutDay = await WorkoutDay.findByPk(workout.workoutDayId);
        if (workoutDay) {
          const dayNumber = parseInt(workoutDay.day.split(' ')[0]);
          if (!isNaN(dayNumber) && dayNumber > userWorkout.currentDay) {
            userWorkout.currentDay = dayNumber;
          }
        }
        
        await userWorkout.save();
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Workout status updated successfully',
      data: workout
    });
  } catch (error) {
    console.error('Error updating workout status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update workout status',
      error: error.message
    });
  }
};