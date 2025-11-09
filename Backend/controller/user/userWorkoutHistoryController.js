const { Op, Sequelize } = require("sequelize");
const { userWorkoutHistory, userWorkout, workout, workoutday, excercise } = require('../../models/index');


// Retrieve all workout history entries for a user
const findAll = async (req, res) => {
    try {
        const userId = req.decoded.id;

        if (!userId) {
            return res.status(400).send({
                message: "User ID is required!"
            });
        }

        // First find all userWorkouts associated with the user
        const userWorkouts = await userWorkout.findAll({
            where: { userId: userId }
        });

        if (userWorkouts.length === 0) {
            return res.status(404).send({
                message: "No workout history found for this user."
            });
        }

        // If there are userWorkouts, proceed to find the workout history
        // Get all the userWorkoutIds
        const userWorkoutIds = userWorkouts.map(workout => workout.id);

        // Now find all workout history entries with these userWorkoutIds
        const data = await userWorkoutHistory.findAll({
            where: {
                UserWorkoutId: {
                    [Op.in]: userWorkoutIds
                }
            },
            order: [['date', 'DESC']]
        });

        const dataWithWorkoutInfo = await Promise.all(
            data.map(async (entry) => {
                return {
                    date: entry.date,
                    completed: entry.completed,
                    duration: entry.duration,
                    calories: entry.caloriesBurned,
                };
            }));

        res.status(200).json(dataWithWorkoutInfo);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving workout history."
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
                    attributes: ['id', 'name', 'description', 'level', 'duration', 'goal', 'equipment', 'calories', 'imagePath', 'role']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });

        // Get history for each workout
        const workoutsWithHistory = await Promise.all(
            activeWorkouts.map(async (UserWorkout) => {
                // Format the lastCompletedDate
                let lastCompleted = "Never";

                if (UserWorkout.lastCompletedDate) {
                    const now = new Date();
                    const lastDate = new Date(UserWorkout.lastCompletedDate);

                    // Calculate the difference in days
                    const diffTime = now - lastDate;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                    // Check if same date (today)
                    if (diffDays === 0 &&
                        now.getDate() === lastDate.getDate() &&
                        now.getMonth() === lastDate.getMonth() &&
                        now.getFullYear() === lastDate.getFullYear()) {
                        lastCompleted = "Today";
                    }
                    // Check if yesterday
                    else if (diffDays === 1 ||
                        (diffDays === 0 &&
                            (now.getDate() - lastDate.getDate() === 1 ||
                                (lastDate.getDate() > now.getDate() &&
                                    lastDate.getMonth() === now.getMonth() - 1)))) {
                        lastCompleted = "Yesterday";
                    }
                    // Within the last week, show as "X days ago"
                    else if (diffDays < 7) {
                        lastCompleted = `${diffDays} days ago`;
                    }
                    // Otherwise show the date
                    else {
                        lastCompleted = lastDate.toLocaleDateString();
                    }
                }

                return {
                    id: UserWorkout.id,
                    workoutId: UserWorkout.workoutId,
                    title: UserWorkout.workouts.title,
                    role: UserWorkout.workouts.role,
                    progress: UserWorkout.progress,
                    nextWorkout: UserWorkout.nextWorkout,
                    lastCompleted: lastCompleted,  // Using the formatted date
                    image: UserWorkout.workouts.imagePath,
                };
            })
        );

        return res.status(200).json(workoutsWithHistory);
    } catch (error) {
        console.error("Error fetching active workouts:", error);
        return res.status(500).json({ message: "Failed to fetch active workouts" });
    }
};


const findAllHistory = async (req, res) => {
    try {
        const userId = req.decoded.id;

        if (!userId) {
            return res.status(400).send({
                message: "User ID is required!"
            });
        }

        const userWorkouts = await userWorkout.findAll({
            where: {
                userId: userId,
            },
            include: [
                {
                    model: workout,
                    as: "workouts",
                    attributes: ["id", "level"]
                }
            ]
        });

        if (!userWorkouts || userWorkouts.length === 0) {
            return res.status(404).send({
                message: "No workout history found for this user."
            });
        }

        const userWorkoutIds = userWorkouts.map(w => w.id);

        // Get workout history entries
        const historyEntries = await userWorkoutHistory.findAll({
            where: {
                UserWorkoutId: { [Op.in]: userWorkoutIds }
            },
            order: [['date', 'DESC']],
            include: [{
                model: userWorkout,
                include: [{
                    model: workout,
                    as: 'workouts',
                    attributes: ['id', 'goal'],
                }]
            }]
        });

        const fullHistory = await Promise.all(historyEntries.map(async (entry) => {
            // Get the associated workout
            const currentUserWorkout = entry.UserWorkout;
            const currentWorkout = currentUserWorkout?.workouts;
            console.log({
                entryId: entry.id,
                workoutdayId: entry.workoutdayId,
                workoutId: currentWorkout.id,
              });

            
            // Each history entry needs day information - either from history data or from UserWorkout
            // Assuming that when a history entry is created, it records the day that was just completed
            // You might need to adjust this based on your app's logic
            const completedDayNumber = entry.workoutdayId;
            console.log("cOMPLETE   "+completedDayNumber)
            console.log(currentWorkout.id)
            let WorkoutDay = null;
            let exercises = [];

            console.log("MLK"+completedDayNumber)
            
            if (currentWorkout && currentWorkout.id) {
                // Find the specific day that corresponds to this history entry
                WorkoutDay = await workoutday.findOne({
                    where: { 
                        WorkoutId: currentWorkout.id,
                        id: completedDayNumber 
                    },
                    include: [{
                        model: excercise,
                        as: 'excercises',
                        through: {
                            attributes: ['sets', 'reps', 'rest_time'],
                        },
                        attributes: ['name'],
                    }]
                });

                
                
                if (WorkoutDay && WorkoutDay.excercises) {
                    exercises = WorkoutDay.excercises.map(ex => ({
                        name: ex.name,
                        sets: ex.WorkoutDayExercise.sets || 0,
                        reps: ex.WorkoutDayExercise.reps || 0,
                        // rest: ex.WorkoutDayExercise.rest_time || 0,
                    }));
                }
            }
            
            return {
                id: entry.id,
                date: entry.date,
                completed: entry.completed,
                duration: entry.duration,
                calories: entry.caloriesBurned,
                workout: currentWorkout || null,
                workoutDay: WorkoutDay ? {
                    // id: WorkoutDay.id,
                    dayName: WorkoutDay.dayName,
                    dayNumber: WorkoutDay.dayNumber,
                    exercises: exercises
                } : null
            };
        }));

        // console.log("kfkf", fullHistory)

        return res.status(200).json(fullHistory);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving workout history."
        });
    }
}


module.exports = {
    findAll,
    getActiveWorkouts,
    findAllHistory
};

