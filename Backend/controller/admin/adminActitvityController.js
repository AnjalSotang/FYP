const { Op, Sequelize } = require("sequelize");
const { userWorkout, workout, users, sequelize} = require('../../models/index');


exports.getSimplifiedActivities = async (req, res) => {
    try {
      // Get limit from query or set default to 20
      const limit = parseInt(req.query.limit) || 20;
      const days = parseInt(req.query.days) || 30; // Default to last 30 days
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Same database queries as in getAdminRecentActivities
      // 1. WORKOUT ADDITIONS - When users add workouts to their plans
      const workoutAdditions = await userWorkout.findAll({
        attributes: [
          'id', 'userId', 'workoutId', 'createdAt'
        ],
        include: [
          {
            model: users,
            as: 'users', // ✅ MUST MATCH THE ALIAS
            attributes: ['id', 'username', 'email']
          },
          {
            model: workout,
            as: 'workouts',
            attributes: ['id', 'name', 'goal', 'level', 'role']
          }
        ],
        where: {
            [Op.and]: [
                Sequelize.where(Sequelize.col('userWorkout.createdAt'), { [Op.gte]: startDate })
              ]
        },
        order: [['createdAt', 'DESC']]
      });

        // 2. WORKOUT CREATIONS - When admins create new workouts
      const workoutCreations = await workout.findAll({
        attributes: [
          'id', 'name', 'level', 'goal', 'createdAt', 'duration', 'role'
        ],
        where: {
          createdAt: { [Op.gte]: startDate }
        },
        order: [['createdAt', 'DESC']]
      });
      

      
      // 3. PLAN COMPLETIONS - When users complete an entire workout plan
      const planCompletions = await userWorkout.findAll({
        attributes: [
          'id', 'userId', 'workoutId', 'updatedAt'
        ],
        where: {
          isActive: false,
          progress: 100,
          updatedAt: { [Op.gte]: startDate }
        },
        include: [
          {
            model: users,
            as: 'users', // ✅ MUST MATCH THE ALIAS
            attributes: ['id', 'username', 'email']
          },
          {
            model: workout,
            as: 'workouts',
            attributes: ['id', 'name', 'goal', 'level'] 
          }
        ],
        where: {
            [Op.and]: [
              Sequelize.where(Sequelize.col('userWorkout.createdAt'), { [Op.gte]: startDate })
            ]
          },
        order: [['updatedAt', 'DESC']]
      });
      
      // 4. WORKOUT RESTARTS - When users restart a completed workout
      const workoutRestarts = await userWorkout.findAll({
        attributes: [
          'id', 'userId', 'workoutId', 'updatedAt'
        ],
        where: {
          isActive: true,
          progress: 0,
          completedWorkouts: 0,
          updatedAt: { 
            [Op.ne]: sequelize.col('createdAt'),
            [Op.gte]: startDate 
          }
        },
        include: [
          {
            model: users,
            as: 'users', // ✅ MUST MATCH THE ALIAS
            attributes: ['id', 'username', 'email']
          },
          {
            model: workout,
            as: 'workouts',
            attributes: ['id', 'name', 'goal', 'level', 'role']
          }
        ],
        where: {
            [Op.and]: [
              Sequelize.where(Sequelize.col('userWorkout.createdAt'), { [Op.gte]: startDate })
            ]
          },
        order: [['updatedAt', 'DESC']]
      });
      
      // Transform to simplified format
      const transformToSimpleFormat = (record, action, isCompletion = false) => {
        // For workout completions, the user is nested deeper
        const user = isCompletion ? 
          record.userWorkout?.users?.username || "Unknown User" : 
          record.users?.username || "Unknown User";
        
        const plan = isCompletion ?
          record.userWorkout?.workouts?.name || "Unknown Workout" :
          record.workouts?.name || "Unknown Workout";
        
        const timestamp = record.updatedAt || record.createdAt;
        
        return {
          id: record.id,
          user: user,
          action: action,
          plan: plan,
          time: getTimeAgo(timestamp)
        };
      };

         // Special transformer for workout creations (admin actions)
         const transformWorkoutCreation = (record) => {
            return {
              id: record.id,
              user: record.role,
              action: "Created new workout plan",
              plan: record.name || "Unknown Workout",
              time: getTimeAgo(record.createdAt)
            };
          };


      
      // Transform each activity type
      const simplifiedAdditions = workoutAdditions.map(record => 
        transformToSimpleFormat(record, "Added workout to their plan")
      );
      
           
      const simplifiedWorkoutCreations = workoutCreations.map(record => 
        transformWorkoutCreation(record)
      );
      
      
      const simplifiedPlanCompletions = planCompletions.map(record => 
        transformToSimpleFormat(record, "Completed workout plan")
      );
      
      const simplifiedRestarts = workoutRestarts.map(record => 
        transformToSimpleFormat(record, "Restarted workout")
      );
      
      // Combine all activities
      const allActivities = [
        ...simplifiedAdditions,
        ...simplifiedWorkoutCreations, // Add workout creations to the activity feed
        ...simplifiedPlanCompletions,
        ...simplifiedRestarts
      ];
      
      // Sort by timestamp (most recent first) and apply limit
      const sortedActivities = allActivities
        .sort((a, b) => {
          // Extract timestamps from time strings for sorting
          const timeA = extractTimeFromAgo(a.time);
          const timeB = extractTimeFromAgo(b.time);
          return timeA - timeB;
        })
        .slice(0, limit);
      
      return res.status(200).json({
        total: sortedActivities.length,
        activities: sortedActivities
      });
    } catch (error) {
      console.error("Error fetching simplified activities:", error);
      return res.status(500).json({ 
        message: "Failed to fetch activities",
        error: error.message,
      });
    }
  };
  
  /**
   * Helper function to extract milliseconds from time ago strings for sorting
   */
  function extractTimeFromAgo(timeAgo) {
    const now = new Date();
    
    if (timeAgo.includes('just now')) {
      return 0;
    } else if (timeAgo.includes('minute')) {
      const minutes = parseInt(timeAgo.match(/\d+/)[0]) || 0;
      return minutes * 60 * 1000;
    } else if (timeAgo.includes('hour')) {
      const hours = parseInt(timeAgo.match(/\d+/)[0]) || 0;
      return hours * 60 * 60 * 1000;
    } else if (timeAgo.includes('day')) {
      const days = parseInt(timeAgo.match(/\d+/)[0]) || 0;
      return days * 24 * 60 * 60 * 1000;
    } else {
      // For date strings, calculate approx difference
      const date = new Date(timeAgo);
      return now - date;
    }
  }
  
  /**
   * Helper function to convert timestamps to relative time
   * This is reused from your existing code
   */
  function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInMin = Math.floor(diffInMs / (1000 * 60));
    const diffInHrs = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHrs / 24);
    
    if (diffInMin < 60) {
      return diffInMin <= 1 ? "just now" : `${diffInMin} minutes ago`;
    } else if (diffInHrs < 24) {
      return `${diffInHrs} hour${diffInHrs === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  }
  