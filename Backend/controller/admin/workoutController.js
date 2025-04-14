const { Op, Sequelize } = require("sequelize");
const { workout, workoutday, excercise, workoutdayExcercise, users, sequelize, userWorkout } = require('../../models/index');
// Import the notification service
const { createUserNotification } = require('../user/notificationController');
// Import admin notification controller
const adminNotificationController = require('../admin/adminNotificationController');

console.log("workoutdayExcercise:", workout);

const createWorkout = async (req, res) => {
  try {
    // 1️⃣ Get Workout Data from Request
    const { name, description, level, duration, goal, calories, equipment } = req.body;
    const image = req.file;  // Multer file upload

    // Validation (Ensure required fields are present)
    if (!name || !description || !level || !duration || !goal || !calories || !equipment) {
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
    const newWorkout = await workout.create({
      name,
      description,
      level,
      duration,
      goal,
      calories,
      equipment,
      imagePath // Save the file path to the database
    });

    // 4️⃣ Get all users and create notifications for them
    const Users = await users.findAll();
    

    // Create a notification for each user
    for (const user of Users) {
      await createUserNotification(
        user.id,
        "New Workout Plan",
        `A new workout '${name}' (${level} level) has been added to the system. Check it out!`,
        'workout_creation',
        newWorkout.id,
        'Workout'
      );  
    }

       // 5️⃣ Create admin notification about the new workout
       try {
        await adminNotificationController.notifyNewWorkoutCreation({
          id: newWorkout.id,
          name: name,
          level: level,
          duration: duration
        });
        console.log(`Admin notification sent for new workout creation: ${name}`);
      } catch (notificationError) {
        // Don't let notification errors affect workout creation
        console.error("Error sending admin notification:", notificationError);
      }
  

    // 5️⃣ Response
    res.status(201).json({
      message: "Workout created successfully!",
      data: newWorkout,
    });

  } catch (error) {
    console.error("Error creating workout:", error); // Detailed error logging
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    if (!res.headersSent) {
      return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
  }
};

const getAllWorkout = async (req, res) => {
  try {
    const workoutPlans = await workout.findAll({
      include: [
        {
          model: workoutday,
          as: 'days',
          attributes: ['id', 'dayName'],
        }
      ],
      order: [['name', 'ASC']]
    });
    
    // Add exercise count to each workout plan
    const workoutPlansWithCounts = await Promise.all(workoutPlans.map(async (plan) => {
      const planJson = plan.toJSON();
      
      // Count total exercises across all days (with duplicates removed)
      const exerciseIds = new Set();
      await Promise.all(planJson.days.map(async (day) => {
        const exercises = await workoutdayExcercise.findAll({
          where: { workoutdayId: day.id },
          attributes: ['excerciseId']  // Using "excercise" spelling
        });
        
        exercises.forEach(exercise => {
          exerciseIds.add(exercise.excerciseId);  // Using "excercise" spelling
        });
      }));
      
      return {
        ...planJson,
        dayCount: planJson.days.length,
        exerciseCount: exerciseIds.size
      };
    }));
    
    return res.status(200).json({data: workoutPlansWithCounts});
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    return res.status(500).json({ error: 'Failed to fetch workout plans' });
  }
};

const getWorkoutMetrics = async (req, res) => {
  try {
      // Get current date and first day of current month
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      // Count total active workout plans
      const totalWorkoutPlans = await workout.count({
          where: { 
              is_active: true 
          }
      });
      
      // Count new workout plans added this month
      const newWorkoutPlansThisMonth = await workout.count({
          where: {
              is_active: true,
              createdAt: {
                  [Op.gte]: firstDayOfMonth
              }
          }
      });
      
      // Format the description string
      const description = `+${newWorkoutPlansThisMonth} new this month`;
      
      res.status(200).json({
          title: "Workout Plans",
          value: totalWorkoutPlans.toString(),
          description: description,
          icon: "ListTodo"
      });
  } catch (error) {
      console.error("Error fetching workout plan metrics:", error);
      res.status(500).json({
          message: "An internal server error occurred. Please try again later.",
          error: error.message
      });
  }
};


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
      goal,
      calories,
      equipment
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
      goal: goal ?? workoutExist.goal,
      calories: calories ?? workoutExist.calories,
      equipment: equipment ?? workoutExist.equipment,
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
    let { query, level } = req.query;
    console.log(req.query);  // Log incoming query parameters

    // Normalize search input (remove spaces, convert to lowercase)
    const searchTerm = query.replace(/\s+/g, "").toLowerCase();

    // Construct filter conditions based on query parameters
    const filters = {
      is_active: true, // Ensure the workout is active
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
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("level")), {
          [Op.like]: `%${searchTerm}%`,
        }),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.fn("REPLACE", Sequelize.col("duration"), " ", "")), {
          [Op.like]: `%${searchTerm}%`,
        })
      ].filter(Boolean), // Remove null values from the array
    };

     // Apply filters for level if specified
     if (level && level !== 'all') {
      filters.level = level;
    }
    
    // Query the database with the constructed filters
    const workouts = await workout.findAll({
      where: filters,
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

// Get workout plan by ID
const getWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const workoutPlan = await workout.findByPk(id, {
      include: [
        {
          model: workoutday,
          as: 'days',
          include: [
            {
              model: excercise,
              as: 'excercises',
              through: {
                attributes: ['sets', 'reps', 'rest_time']
              }
            }
          ]
        }
      ]
    });
    
    if (!workoutPlan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    
    return res.status(200).json({ data: workoutPlan });
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    return res.status(500).json({ error: 'Failed to fetch workout plan' });
  }
};

const getPopularWorkoutPlans = async (req, res) => {
  try {
    // Get all workouts
    const workouts = await workout.findAll({
      attributes: [
        'id',
        'name',
        'goal',
        'level',
        'imagePath'
      ]
    });

    // Get count of users per workout
    const userCounts = await userWorkout.findAll({
      attributes: [
        'workoutId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'userCount']
      ],
      group: ['workoutId']
    });

    // Get count of users who joined in last 7 days per workout
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUserCounts = await userWorkout.findAll({
      attributes: [
        'workoutId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'recentCount']
      ],
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      },
      group: ['workoutId']
    });

    // Create a map for quick lookup
    const countMap = {};
    userCounts.forEach(count => {
      countMap[count.workoutId] = parseInt(count.get('userCount'));
    });

    const recentCountMap = {};
    recentUserCounts.forEach(count => {
      recentCountMap[count.workoutId] = parseInt(count.get('recentCount'));
    });

    // Merge data and calculate trends
    const formattedWorkouts = workouts.map(workoutItem => {
      const count = countMap[workoutItem.id] || 0;
      const recentCount = recentCountMap[workoutItem.id] || 0;
      
      // Calculate trend (up if more than 10% of users joined in the last week)
      const trend = (recentCount / (count || 1)) > 0.1 ? 'up' : 'down';
      
      return {
        id: workoutItem.id,
        name: workoutItem.name,
        users: count,
        trend: trend,
        category: workoutItem.goal,
        level: workoutItem.level,
        image: workoutItem.imagePath || "/placeholder.svg?height=40&width=40"
      };
    });

    // Sort by user count and limit to top 5
    formattedWorkouts.sort((a, b) => b.users - a.users);
    const topWorkouts = formattedWorkouts.slice(0, 5);

    // Return response
    res.status(200).json({
      data: topWorkouts
    });
  } catch (error) {
    console.error("Error fetching popular workout plans:", error);
    res.status(500).json({
      message: "An internal server error occurred while fetching popular workout plans.",
      error: error.message
    });
  }
};



module.exports = {
  createWorkout,
  getAllWorkout,
  deleteWorkout,
  updateWorkout,
  searchWorkouts,
  getWorkout,
  getWorkoutMetrics,
  getPopularWorkoutPlans
}
