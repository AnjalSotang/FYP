const { Op, Sequelize } = require("sequelize");
const { userWorkoutHistory, userWorkout, workout } = require('../../models/index');


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
                    attributes: ['id', 'name', 'description', 'level', 'duration', 'goal', 'equipment', 'calories', 'imagePath']
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

module.exports = {
    findAll,
    getActiveWorkouts
};


