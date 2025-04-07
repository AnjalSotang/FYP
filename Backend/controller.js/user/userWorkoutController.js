const { Op, Sequelize } = require("sequelize");
const { userWorkout, workout, users, workoutday, userWorkoutHistory, sequelize, workoutdayExcercise, excercise } = require('../../models/index');

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
    const workoutPlan = await workout.findOne({
      where: { id: WorkoutId },
      include: [
        {
          model: workoutday, // Ensure you're including WorkoutDay to fetch it
          as: 'days', // Use 'days' as per your association
          order: [['day', 'ASC']]
        }
      ]
    });
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

    // Calculate total workout
    // Parse duration (e.g., "30 days" -> 30)
    const durationMatch = workoutPlan.duration.match(/(\d+)/);
    const durationValue = durationMatch ? parseInt(durationMatch[0]) : 0;

    // Get the number of workout days
    const workoutCount = workoutPlan.days ? workoutPlan.days.length : 0;

    // Calculate total workout
    const totalWorkout = durationValue * workoutCount;

    console.log("Total Workout:", totalWorkout);

    // Determine the next workout (initial next workout is the first day)
    let nextWorkout = null;
    if (workoutPlan.days && workoutPlan.days.length > 0) {
      // Take the first day
      const firstDay = workoutPlan.days[0];

      // Store a string that describes the next workout day
      nextWorkout = `${firstDay.dayName}`;
    }

    // Create a new UserWorkout record
    const newUserWorkout = await userWorkout.create({
      userId,
      workoutId: WorkoutId,
      totalWorkouts: totalWorkout,
      nextWorkout: nextWorkout,
      startDate: new Date()
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



const getActiveWorkouts = async (req, res) => {
  try {
    const userId = req.decoded.id; // Assuming you have authentication middleware that sets userId
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token." });
    }
    console.log("Decoded User ID:", userId);


    const activeWorkouts = await userWorkout.findAll({
      where: {
        userId: userId,
        isActive: true
      },
      include: [
        {
          model: workout,
          as: 'workouts',  // Use the same alias from the association
          attributes: ['id', 'name', 'description', 'level', 'duration', 'goal', 'equipment', 'calories', 'imagePath']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Get history for each workout
    const workoutsWithHistory = await Promise.all(
      activeWorkouts.map(async (UserWorkout) => {
        const history = await userWorkoutHistory.findAll({
          where: { UserWorkoutId: UserWorkout.id },
          order: [['createdAt', 'DESC']],
          limit: 7
        });

        // Format history for frontend
        const formattedHistory = history.map(entry => {
          const date = new Date(entry.createdAt);
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completed: entry.completed,
            duration: entry.duration || 0
          };
        });

        console.log(UserWorkout.workouts.imagePath,);

        return {
          id: UserWorkout.id,
          workoutId: UserWorkout.workoutId,
          title: UserWorkout.workouts.name,
          progress: UserWorkout.progress,
          nextWorkout: UserWorkout.nextWorkout,
          // lastCompleted: lastCompleted,
          startDate: new Date(UserWorkout.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          image: UserWorkout.workouts.imagePath,
          category: UserWorkout.workouts.goal,
          level: UserWorkout.workouts.level,
          completedWorkouts: UserWorkout.completedWorkouts,
          totalWorkouts: UserWorkout.totalWorkouts,
          streak: UserWorkout.streak,
          history: formattedHistory
        };
      })
    );

    return res.status(200).json(workoutsWithHistory);
  } catch (error) {
    console.error("Error fetching active workouts:", error);
    return res.status(500).json({ message: "Failed to fetch active workouts" });
  }
};


const getCompletedWorkouts = async (req, res) => {
  try {
    const userId = req.decoded.id; // Assuming you have authentication middleware that sets userId
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token." });
    }
    console.log("Decoded User ID:", userId);


    const completedWorkouts = await userWorkout.findAll({
      where: {
        userId: userId,
        isActive: false,
        completedWorkouts: {
          [Op.eq]: sequelize.col('totalWorkouts') // Only truly completed workouts
        }
      },
      include: [
        {
          model: workout,
          as: 'workouts',  // Use the same alias from the association
          attributes: ['id', 'name', 'level', 'duration', 'goal', 'imagePath']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Get user ratings if available
    const workoutsWithRating = completedWorkouts.map(userWorkout => {
      return {
        id: userWorkout.id,
        workoutId: userWorkout.workoutId,
        title: userWorkout.workouts.name,
        completedDate: new Date(userWorkout.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration: userWorkout.workouts.duration,
        image: userWorkout.workouts.imagePath || "/placeholder.svg?height=200&width=300",
        category: userWorkout.workouts.goal,
        level: userWorkout.workouts.level,
        completedWorkouts: userWorkout.completedWorkouts,
        totalWorkouts: userWorkout.totalWorkouts,
        rating: 4 // Default rating, could be fetched from a ratings table
      };
    });

    return res.status(200).json(workoutsWithRating);
  } catch (error) {
    console.error("Error fetching completed workouts:", error);
    return res.status(500).json({ message: "Failed to fetch completed workouts" });
  }
};

const addWorkoutPlan = async (req, res) => {
  try {
    const userId = req.decoded;
    const { workoutId } = req.body;

    // Check if the workout plan exists
    const workoutPlan = await workout.findOne({
      where: { id: workoutId },
      include: [
        {
          model: workoutday, // Ensure you're including WorkoutDay to fetch it
          as: 'days', // Use 'days' as per your association
          order: [['day', 'ASC']]
        }
      ]
    });

    if (!workoutPlan) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Check if user already has this workout active
    const existingUserWorkout = await userWorkout.findOne({
      where: {
        userId: userId,
        workoutId: workoutId,
        isActive: true
      }
    });

    if (existingUserWorkout) {
      return res.status(400).json({ message: "This workout plan is already active" });
    }

    // Create user workout
    const totalDays = workoutPlan.days.length;
    const UserWorkout = await userWorkout.create({
      userId: userId,
      workoutId: workoutId,
      progress: 0,
      currentDay: 1,
      totalWorkouts: totalDays,
      nextWorkout: totalDays > 0 ? `Day 1: ${workoutPlan.days[0].dayName}` : "No workouts scheduled",

    });

    return res.status(201).json({
      message: "Workout plan added successfully",
      userWorkout: {
        id: UserWorkout.id,
        workoutId: workoutPlan.id,
        title: workoutPlan.name,
        progress: 0,
        nextWorkout: UserWorkout.nextWorkout,
        lastCompleted: "Not started",
        startDate: new Date(UserWorkout.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: workoutPlan.imagePath || "/placeholder.svg?height=200&width=300",
        category: workoutPlan.goal,
        level: workoutPlan.level,
        completedWorkouts: 0,
        totalWorkouts: totalDays,
        streak: 0,
        history: []
      }
    });
  } catch (error) {
    console.error("Error adding workout plan:", error);
    return res.status(500).json({ message: "Failed to add workout plan" });
  }
};

// Get user workout by ID with next day's exercises
const getUserWorkout = async (req, res) => {
  try {
    // Extract user ID from the decoded token
    let userId = req.decoded.id;
    const id = req.params.userid;
    console.log("Decoded User ID:", userId);
    console.log("User ID from params:", id);

    // Find the user's workout
    const UserWorkout = await userWorkout.findOne({
      where: {
        userId: userId,
        id: id,
        isActive: true
      },
      include: [
        {
          model: workout,
          as: "workouts",
          attributes: ["id", "name", "description", "level", "duration", "imagePath", "goal"]
        }
      ]
    });

    if (!UserWorkout) {
      return res.status(404).json({ message: "User workout not found" });
    }

    // Get all workout days to calculate total days
    const WorkoutDays = await workoutday.findAll({
      where: { workoutId: UserWorkout.workoutId },
      order: [['id', 'ASC']]
    });

    if (!WorkoutDays || WorkoutDays.length === 0) {
      return res.status(404).json({ message: "No workout days found for this workout" });
    }

    // Calculate which day in the cycle we should show based on currentDay
    const totalDaysInCycle = WorkoutDays.length;
    const cycleIndex = (UserWorkout.currentDay - 1) % totalDaysInCycle;
    const currentWorkoutDay = WorkoutDays[cycleIndex];

    if (!currentWorkoutDay) {
      return res.status(404).json({ message: "Current workout day not found" });
    }

    // Get exercises for the current day
    const Exercises = await workoutdayExcercise.findAll({
      where: { workoutdayId: currentWorkoutDay.id },
      include: [
        {
          model: excercise,
          as: "excercises",
          attributes: ["id", "name", "equipment", "imagePath", "instructions"]
        }
      ]
    });

    // Calculate which week the user is in
    const currentWeek = Math.floor((UserWorkout.currentDay - 1) / totalDaysInCycle) + 1;

    // Format the response in the requested structure
    const formattedExercises = Exercises.map(exercise => ({
      id: exercise.excercises.id,
      name: exercise.excercises.name,
      sets: exercise.sets,
      reps: exercise.reps,
      rest: `${exercise.rest_time} sec`,
      equipment: exercise.excercises.equipment,
      instructions: exercise.excercises.instructions,
      completed: false // Default to false, could be updated based on user progress tracking
    }));

    const formattedResponse = {
      id: UserWorkout.id,
      title: UserWorkout.workouts.name,
      progress: UserWorkout.progress,
      currentDay: UserWorkout.currentDay,
      totalDays: UserWorkout.totalWorkouts,
      currentWeek: currentWeek,
      cycleDay: cycleIndex + 1, // Day number within the current cycle (1-based)
      level: UserWorkout.workouts.level,
      category: UserWorkout.workouts.goal || "General Fitness",
      image: UserWorkout.workouts.imagePath,
      days: [
        {
          day: UserWorkout.currentDay,
          dayName: currentWorkoutDay.dayName || `Day ${cycleIndex + 1}`,
          focus: currentWorkoutDay.focus || currentWorkoutDay.dayName,
          weekInfo: `Week ${currentWeek}, Day ${cycleIndex + 1}`,
          exercises: formattedExercises
        }
      ]
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching user workout:", error);
    res.status(500).json({ message: "Error fetching user workout", error: error.message });
  }
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
    const { id } = req.params;
    console.log("UserWorkoutId from request:", id);

    // Validate if the WorkoutId is provided
    if (!id) {
      return res.status(400).json({ message: "UserWorkout Id is required." });
    }

    // Check if the user has the workout in their plan
    const existingUserWorkout = await userWorkout.findOne({
      where: { userId, id: id },
    });
    if (!existingUserWorkout) {
      return res.status(404).json({ message: "Workout not found in your plan." });
    }

    // Delete the UserWorkout record
    // await userWorkout.destroy({
    //   where: { userId, workoutId: WorkoutId },
    // });

    await userWorkout.destroy({
      where: { id: id },
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

const completeWorkoutDay = async (req, res) => {
  try {
    const userId = req.decoded.id;
    const { id } = req.params;
    const { duration } = req.body;
    console.log(`Completing workout: userId=${userId}, workoutId=${id}, duration=${duration}`);


    const UserWorkout = await userWorkout.findOne({
      where: {
        id: id,
        userId: userId,
        isActive: true
      },
      include: [
        {
          model: workout,
          as: 'workouts',
          include: [{ model: workoutday, as: 'days', order: [['day', 'ASC']] }]
        }
      ]
    });

    if (!UserWorkout) {
      return res.status(404).json({ message: "Active workout plan not found" });
    }

    // Find the current workout day
    // Find the current workout day with proper cycling
    const toDaysInWorkout = UserWorkout.workouts.days.length;
    const caloriesBurned = UserWorkout.workouts.calories ? parseInt(UserWorkout.workouts.calories, 10) || 0 : 0;
    const currentDayIndex = (UserWorkout.currentDay - 1) % toDaysInWorkout;
    const currentWorkoutDay = UserWorkout.workouts.days[currentDayIndex];

    console.log(caloriesBurned)

    if (!currentWorkoutDay) {
      return res.status(400).json({ message: "Invalid workout day" });
    }
    // Add debugging to see the exact day name
    console.log("Current day name:", currentWorkoutDay.dayName);
    console.log("Is rest day check:", currentWorkoutDay.dayName === "Rest Day");

    // Update the condition to be more flexible
    if (currentWorkoutDay.dayName && currentWorkoutDay.dayName.toLowerCase().includes("rest")) {
      console.log("Creating rest day history");
      // Create history record for Rest Day
      await userWorkoutHistory.create({
        UserWorkoutId: UserWorkout.id,
        completed: true,
        duration: 0, // Set duration to 0 for rest days
        caloriesBurned: 0,
        isRestDay: true, // Add this flag
        notes: `Completed rest day ${UserWorkout.currentDay}`
      }).then(record => {
        console.log("Rest day record created:", record.id);
      }).catch(err => {
        console.error("Failed to create rest day record:", err);
      });
    }
    else {
      // Create history record for completed workout day
      await userWorkoutHistory.create({
        UserWorkoutId: UserWorkout.id,
        completed: true,
        duration: duration,
        caloriesBurned: caloriesBurned,
        notes: `Completed ${currentWorkoutDay.dayName}`,
        isRestDay: false // Set this flag to false
      }).then(record => {
        console.log("Workout record created:", record.id);
      }).catch(err => {
        console.error("Failed to create workout record:", err);
      });
    }

    // Update user workout
    const completedWorkouts = UserWorkout.completedWorkouts + 1;
    const totalWorkouts = UserWorkout.totalWorkouts;
    const totalDaysInWorkout = UserWorkout.workouts.days.length;

    // Calculate next day, cycling through workout days
    let nextDayIndex = UserWorkout.currentDay % totalDaysInWorkout;
    // If nextDayIndex is 0, it means we've completed a cycle, go back to the first day (index 0)
    if (nextDayIndex === 0) {
      nextDayIndex = 0;
    } else {
      nextDayIndex = nextDayIndex; // This is the current day, and we want the next index
    }

    // Determine next currentDay value (always incrementing)
    const currentDay = UserWorkout.currentDay + 1;

    // Check if we've completed all workouts in the plan
    let nextWorkout = "";
    let isActive = true;

    if (completedWorkouts >= totalWorkouts) {
      // All workouts in the plan are complete
      nextWorkout = "All Workouts Completed";
      isActive = false;
    } else {
      const totalDaysInCycle = UserWorkout.workouts.days.length;

      // Calculate which week the user will be in for the next workout
      // Use ceiling division to ensure Week 1 includes days 1-totalDaysInCycle
      const nextWeek = Math.ceil(currentDay / totalDaysInCycle);

      // Get the next day in the cycle (1-indexed for display)
      const nextDayIndex = currentDay % totalDaysInCycle || totalDaysInCycle;
      const actualDayIndex = (nextDayIndex - 1 + totalDaysInCycle) % totalDaysInCycle;

      // Create a more informative nextWorkout string
      nextWorkout = `Week ${nextWeek}, Day ${nextDayIndex}: ${UserWorkout.workouts.days[actualDayIndex].dayName}`;

    }

    // Calculate progress based on completed workouts
    const progress = Math.round((completedWorkouts / totalWorkouts) * 100);

    // Calculate streak
    const today = new Date();
    const lastCompleted = UserWorkout.lastCompletedDate ? new Date(UserWorkout.lastCompletedDate) : null;
    let streak = UserWorkout.streak;

    if (lastCompleted) {
      const diffTime = Math.abs(today - lastCompleted);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        streak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        streak = 1;
      }
      // If diffDays is 0 (same day), don't increment streak
    } else {
      // First workout
      streak = 1;
    }

    await UserWorkout.update({
      completedWorkouts,
      progress,
      currentDay,
      nextWorkout,
      lastCompletedDate: today,
      streak,
      isActive
    }, {
      where: { id: UserWorkout.id }
    });

    return res.status(200).json({
      message: "Workout day completed successfully",
      progress,
      completedWorkouts,
      totalWorkouts,
      nextWorkout,
      streak
    });
  } catch (error) {
    console.error("Error completing workout day:", error);
    return res.status(500).json({ message: "Failed to complete workout day" });
  }
};


const restartWorkout = async (req, res) => {
  try {
    const userId = req.decoded.id;
    const { id } = req.params;

    // Find the completed workout with proper association
    const completedWorkout = await userWorkout.findOne({
      where: {
        id: id,
        userId: userId,
        isActive: false
      },
      include: [{ model: workout, as: 'workouts' }]
    });

    if (!completedWorkout) {
      return res.status(404).json({ message: "Completed workout plan not found" });
    }

    // Bug fix: Check if workout association was properly loaded
    if (!completedWorkout.workouts) {
      return res.status(404).json({ message: "Associated workout details not found" });
    }

    // Get the workout plan to determine next workout details
    const workoutPlan = await workout.findOne({
      where: { id: completedWorkout.workoutId },
      include: [{
        model: workoutday,
        as: 'days',
        order: [['day', 'ASC']]
      }]
    });

    // Determine the proper nextWorkout value
    let nextWorkout = "Day 1: Getting Started";
    if (workoutPlan && workoutPlan.days && workoutPlan.days.length > 0) {
      nextWorkout = `${workoutPlan.days[0].dayName}`;
    }

    // Create a new active workout
    const newUserWorkout = await completedWorkout.update({
      progress: 0,
      currentDay: 1,
      nextWorkout: nextWorkout,
      startDate: new Date(),
      completedWorkouts: 0,
      streak: 0,
      isActive: true
    });


    // Bug fix: Use the correct association name
    const workoutDetails = completedWorkout.workouts;

    // Return standardized response
    return res.status(201).json({
      message: "Workout plan restarted successfully",
      userWorkout: {
        id: newUserWorkout.id,
        workoutId: workoutDetails.id,
        title: workoutDetails.name,
        progress: 0,
        nextWorkout: newUserWorkout.nextWorkout,
        lastCompleted: "Not started",
        startDate: new Date(newUserWorkout.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: workoutDetails.imagePath || "/placeholder.svg?height=200&width=300",
        category: workoutDetails.goal,
        level: workoutDetails.level,
        completedWorkouts: 0,
        totalWorkouts: newUserWorkout.totalWorkouts,
        streak: 0,
        history: []
      }
    });
  } catch (error) {
    console.error("Error restarting workout plan:", error);
    return res.status(500).json({
      message: "Failed to restart workout plan",
      error: error.message
    });
  }
};


module.exports = {
  createUserWorkout,
  getUserWorkout,
  deleteUserWorkout,
  getActiveWorkouts,
  getCompletedWorkouts,
  addWorkoutPlan,
  completeWorkoutDay,
  restartWorkout,
};

