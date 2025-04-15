const express = require("express");
const router = express.Router();
const { workout, workoutday, excercise, workoutdayExcercise, users } = require("../models");
const adminNotificationController = require("../controller/admin/adminNotificationController");
require("dotenv").config();

// Helper function to calculate calories
function calculateCalories(duration, goal) {
  let baseCalories = duration * 5;

  if (goal === "lose-weight") {
    baseCalories *= 1.2;
  } else if (goal === "build-muscle") {
    baseCalories *= 0.9;
  }

  const minCalories = Math.round(baseCalories * 0.8);
  const maxCalories = Math.round(baseCalories * 1.2);

  return `${minCalories}-${maxCalories}`;
}

// Helper function to create a workout in the database
async function createWorkoutInDB(workoutData, userId) {
  try {
    console.log("Creating workout with data:", JSON.stringify(workoutData, null, 2));
    
    // Create the main workout
    const newWorkout = await workout.create({
      name: workoutData.title,
      description: workoutData.description,
      level: workoutData.level,
      duration: workoutData.duration || 45, // Default if not provided
      goal: workoutData.goal,
      calories: workoutData.calories,
      equipment: Array.isArray(workoutData.equipment) ? workoutData.equipment.join(', ') : workoutData.equipment,
      imagePath: workoutData.image || '/placeholder.svg',
      role: 'user',
    });

    console.log(`Created main workout with ID: ${newWorkout.id}`);

    // Create workout days
    for (const day of workoutData.days) {
      // Skip if day is not properly formed
      if (!day || !day.day) {
        console.warn("Skipping invalid day:", day);
        continue;
      }

      const dayFocus = day.focus || "General Workout";
      
      // For Rest Day, use just "Rest Day" without the "Day X" prefix
      const dayName = dayFocus === 'Rest Day' 
        ? "Rest Day"
        : `Day ${day.day}: ${dayFocus}`;
      
      const newDay = await workoutday.create({
        dayName: dayName,
        WorkoutId: newWorkout.id,
        dayNumber: day.day
      });
      
      console.log(`Created day ${day.day} with ID: ${newDay.id}`);

      // Skip exercises if it's a rest day or no exercises provided
      if (dayFocus === 'Rest Day' || !day.exercises || !Array.isArray(day.exercises) || day.exercises.length === 0) {
        console.log(`Day ${day.day} is a rest day or has no exercises, skipping exercise creation`);
        continue;
      }

      // Add exercises to the day
      for (const exerciseData of day.exercises) {
        if (!exerciseData || !exerciseData.name) {
          console.warn("Skipping invalid exercise:", exerciseData);
          continue;
        }

        // First check if exercise exists, if not create it
        let exerciseRecord = await excercise.findOne({
          where: { name: exerciseData.name }
        });

        if (!exerciseRecord) {
          // Create new exercise with all available attributes
          exerciseRecord = await excercise.create({
            name: exerciseData.name,
            muscle_group: dayFocus,
            difficulty_level: workoutData.level || "Intermediate", // Use workout level if available
            instructions: exerciseData.instructions || `Perform ${exerciseData.name} with proper form`,
            equipment: exerciseData.equipment || "None",
            category: dayFocus,
            imagePath: exerciseData.imagePath || "/exercise-placeholder.svg",
            burned_calories: exerciseData.burned_calories || Math.floor(Math.random() * 200) + 100, // Random if not provided
            duration: exerciseData.duration || Math.floor((workoutData.duration || 45) / (day.exercises.length || 1)),
            is_active: true
          });
          console.log(`Created new exercise: ${exerciseData.name} with ID: ${exerciseRecord.id}`);
        } else {
          console.log(`Using existing exercise: ${exerciseData.name} with ID: ${exerciseRecord.id}`);
        }

        // Parse sets, reps and rest time safely
        let sets = 3; // Default
        if (exerciseData.sets) {
          sets = typeof exerciseData.sets === 'number' ? 
            exerciseData.sets : 
            parseInt(exerciseData.sets) || 3;
        }
        
        const reps = exerciseData.reps ? 
          exerciseData.reps.toString() : 
          "10-12"; // Default

        // Extract rest time - handle formats like "60-90 seconds" or "60 seconds"
        let restTime = 60; // Default in seconds
        if (exerciseData.rest) {
          // Check if rest is a string before using match
          if (typeof exerciseData.rest === 'string') {
            // Try to extract number from strings like "60-90 seconds"
            const restMatch = exerciseData.rest.match(/(\d+)/);
            if (restMatch && restMatch[1]) {
              restTime = parseInt(restMatch[1]);
            }
          } else if (typeof exerciseData.rest === 'number') {
            // If rest is already a number, use it directly
            restTime = exerciseData.rest;
          }
        }

        // Create the relationship between workout day and exercise with sets, reps, etc.
        await workoutdayExcercise.create({
          workoutdayId: newDay.id,
          excerciseId: exerciseRecord.id,
          sets: sets,
          reps: reps,
          rest_time: restTime
        });
        
        console.log(`Added exercise ${exerciseData.name} to day ${day.day} with sets: ${sets}, reps: ${reps}, rest: ${restTime}`);
      }
    }

    // Get the complete workout with all relationships
    const completeWorkout = await workout.findByPk(newWorkout.id, {
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

    return completeWorkout;
  } catch (error) {
    console.error("Error creating workout in database:", error);
    throw error;
  }
}



// Helper function to create user notifications
const createUserNotification = async (
  userId, 
  title, 
  message, 
  type, 
  referenceId, 
  referenceType
) => {
  // This function implementation would be defined elsewhere
  // or imported from a notification service
  console.log(`Creating notification for user ${userId}: ${title}`);
  // Placeholder implementation - replace with actual notification logic
};

router.post("/generate-workout", async (req, res) => {
  const { goal, experience, days, duration, equipment, focus, additionalInfo, userId } = req.body;

  // Validate required inputs
  if (!goal || !experience || !days || !duration || !equipment) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate numeric inputs
  if (isNaN(parseInt(days)) || isNaN(parseInt(duration))) {
    return res.status(400).json({ error: "Days and duration must be numbers" });
  }

  const prompt = `
  Generate a detailed workout plan with the following specifications:
  
  Goal: ${goal}
  Experience Level: ${experience}
  Days per week: ${days} (active workout days)
  Duration per session: ${duration} minutes
  Available Equipment: ${equipment}
  Focus Areas: ${focus && focus.length > 0 ? focus.join(", ") : "Full Body"}
  Additional Information: ${additionalInfo || "None"}
  
  Create a 7-day weekly schedule where ${days} days are workout days and the remaining days are rest days. Place rest days strategically to allow for muscle recovery.
  
  For each workout day, provide:
  1. A focus area (e.g., "Upper Body", "Lower Body", "Core", etc.)
  2. A list of 4-6 exercises with sets, reps, rest periods, and equipment needed
  3. Include specific instructions for each exercise where possible
  4. Estimate a duration and burned calories for each exercise
  
  For rest days, simply indicate "Rest Day" as the focus with no exercises.
  
  Format the response as a JSON object with the following structure:
  {
    "title": "Name of the workout plan",
    "description": "Brief description of the workout plan",
    "days": [
      {
        "day": 1,
        "focus": "Focus area for day 1",
        "exercises": [
          {
            "name": "Exercise name",
            "sets": number,
            "reps": "rep range or count",
            "rest": number, // rest period in seconds
            "equipment": "equipment needed",
            "instructions": "Step-by-step instructions for performing the exercise",
            "duration": number, // in minutes
            "burned_calories": number // estimated calories burned
          }
        ]
      },
      {
        "day": 2,
        "focus": "Rest Day",
        "exercises": []  // Empty array for rest days
      },
      // Continue for all 7 days of the week
    ]
  }
  
  Ensure you provide exactly 7 days total, with ${days} workout days and ${7-days} rest days. For rest periods, use numeric values in seconds (e.g., 60 for 60 seconds). The response must be valid JSON and should only include the JSON object, nothing else.
  `;
  
  try {
    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Using Llama 3 8B model
        messages: [
          {
            role: "system",
            content: "You are an expert fitness trainer who creates customized workout plans. Always respond with valid JSON that matches the requested format exactly. For rest periods, use numeric values in seconds (e.g. 60 for 60 seconds). Do not include any text outside the JSON structure."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" } // Ensures JSON output
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("API response not OK:", response.status, response.statusText);
      return res.status(response.status).json({ error: `API error: ${response.statusText}` });
    }

    // Parse the API response
    const result = await response.json();
    console.log("API response structure:", Object.keys(result));
    
    // Get the content from the API response
    let workoutPlanContent = result?.choices?.[0]?.message?.content;
    
    if (!workoutPlanContent) {
      console.error("Empty content from API:", result);
      return res.status(500).json({ error: "No workout plan content in API response" });
    }

    // Log the type and a sample of content for debugging
    console.log("Workout plan content type:", typeof workoutPlanContent);
    console.log("Workout plan content sample:", 
      typeof workoutPlanContent === 'string' ? 
        workoutPlanContent.substring(0, 200) : 
        JSON.stringify(workoutPlanContent).substring(0, 200)
    );

    // Parse the workout plan or use it directly if already parsed
    let workoutPlan;
    try {
      if (typeof workoutPlanContent === 'string') {
        // If the content is a string, parse it as JSON
        workoutPlan = JSON.parse(workoutPlanContent);
      } else if (typeof workoutPlanContent === 'object') {
        // If the content is already an object, use it directly
        workoutPlan = workoutPlanContent;
      } else {
        throw new Error(`Unexpected response format: ${typeof workoutPlanContent}`);
      }
    } catch (parseError) {
      console.error("Error parsing workout plan:", parseError);
      console.error("Raw content:", workoutPlanContent);
      return res.status(500).json({ 
        error: "Failed to parse workout plan",
        message: parseError.message,
        contentType: typeof workoutPlanContent
      });
    }
    
    // Basic validation that the workout plan has the expected structure
    if (!workoutPlan.title || !workoutPlan.description || !Array.isArray(workoutPlan.days)) {
      console.error("Workout plan missing required fields:", workoutPlan);
      return res.status(500).json({ 
        error: "Generated workout plan is missing required fields",
        receivedFields: Object.keys(workoutPlan)
      });
    }
    
    // Add additional info to the workout plan
    const finalWorkout = {
      ...workoutPlan,
      level: experience,
      category: focus && focus.length > 0 ? focus[0] : "Full Body",
      calories: calculateCalories(parseInt(duration), goal),
      image: "/placeholder.svg",
      equipment: [equipment],
      duration: parseInt(duration),
      goal: goal
    };

    // Log the final workout plan for debugging
    console.log("Final workout plan structure:", Object.keys(finalWorkout));
    console.log("Final workout days count:", finalWorkout.days.length);

    // Save the workout to the database
    try {
      const savedWorkout = await createWorkoutInDB(finalWorkout, userId);
      
      // Create notification for the user
      if (userId) {
        await createUserNotification(
          userId,
          "Custom Workout Plan Created",
          `Your custom workout plan '${finalWorkout.title}' has been created successfully!`,
          'workout_creation',
          savedWorkout.id,
          'Workout'
        );
      }

      // Create admin notification about the new workout
      try {
        await adminNotificationController.notifyNewWorkoutCreation({
          id: savedWorkout.id,
          name: savedWorkout.name,
          level: savedWorkout.level,
          duration: savedWorkout.duration
        });
        console.log(`Admin notification sent for new workout creation: ${savedWorkout.name}`);
      } catch (notificationError) {
        console.error("Error sending admin notification:", notificationError);
      }

      // Return success response with the created workout
      res.status(201).json({ 
        message: "Workout plan created successfully", 
        workout: savedWorkout 
      });
      
    } catch (dbError) {
      console.error("Database error:", dbError);
      res.status(500).json({ 
        error: "Failed to save workout plan to database",
        message: dbError.message
      });
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Request timed out");
      return res.status(504).json({ error: "Request to AI service timed out" });
    }
    
    console.error("Error generating workout:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message
    });
  }
});

// Get a specific workout with all related days and exercises
router.get("/:id", async (req, res) => {
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
});

module.exports = router;