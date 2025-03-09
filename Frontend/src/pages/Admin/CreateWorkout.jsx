import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [workoutDetails, setWorkoutDetails] = useState({
    name: '',
    description: '',
    difficulty_level: 'Beginner',
    duration: '',
    goal: '',
    is_active: true
  });

  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(true);  // For loading state
  const [error, setError] = useState(null);      // For error handling

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('/api/exercises');  // Update with actual endpoint
        if (response.data && response.data.length > 0) {
          setExercises(response.data);
        } else {
          setExercises([]);  // If no exercises are available, set to an empty array
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setError('There was an error fetching the exercises.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleExerciseChange = (exerciseId, sets, reps, restTime) => {
    setSelectedExercises(prevState => {
      const updatedExercises = prevState.map(exercise => {
        if (exercise.exercise_id === exerciseId) {
          return { ...exercise, sets, reps, rest_time: restTime };
        }
        return exercise;
      });

      if (!updatedExercises.some(ex => ex.exercise_id === exerciseId)) {
        updatedExercises.push({
          exercise_id: exerciseId,
          sets,
          reps,
          rest_time: restTime
        });
      }
      return updatedExercises;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      workoutDetails,
      selectedExercises
    };

    try {
      const response = await axios.post('/api/workouts', data);  // Update with actual endpoint
      console.log('Workout created:', response.data);
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create a New Workout</h2>

        {/* Workout Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Workout Name</label>
            <input
              type="text"
              value={workoutDetails.name}
              onChange={(e) => setWorkoutDetails({ ...workoutDetails, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter workout name"
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              value={workoutDetails.description}
              onChange={(e) => setWorkoutDetails({ ...workoutDetails, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter workout description"
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700">Difficulty Level</label>
              <select
                value={workoutDetails.difficulty_level}
                onChange={(e) => setWorkoutDetails({ ...workoutDetails, difficulty_level: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Duration (mins)</label>
              <input
                type="number"
                value={workoutDetails.duration}
                onChange={(e) => setWorkoutDetails({ ...workoutDetails, duration: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Duration in minutes"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Goal</label>
            <input
              type="text"
              value={workoutDetails.goal}
              onChange={(e) => setWorkoutDetails({ ...workoutDetails, goal: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter goal (e.g., strength, fat loss)"
            />
          </div>
        </div>

        {/* Exercises Selection with Sets, Reps, and Rest Time */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Select Exercises</h3>

          {loading ? (
            <p className="text-center text-gray-500">Loading exercises...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : exercises.length === 0 ? (
            <p className="text-center text-gray-500">No exercises available</p>
          ) : (
            <div className="space-y-2">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    onChange={() => handleExerciseChange(exercise.id, 3, 10, 30)}  // Default values for sets, reps, rest
                    className="form-checkbox"
                  />
                  <span className="text-gray-700">{exercise.name}</span>

                  {/* Fields for sets, reps, and rest time */}
                  <div className="flex space-x-4">
                    <div className="w-1/4">
                      <label className="block text-gray-700">Sets</label>
                      <input
                        type="number"
                        onChange={(e) => handleExerciseChange(exercise.id, e.target.value, exercise.reps, exercise.rest_time)}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Sets"
                      />
                    </div>
                    <div className="w-1/4">
                      <label className="block text-gray-700">Reps</label>
                      <input
                        type="number"
                        onChange={(e) => handleExerciseChange(exercise.id, exercise.sets, e.target.value, exercise.rest_time)}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Reps"
                      />
                    </div>
                    <div className="w-1/4">
                      <label className="block text-gray-700">Rest Time (sec)</label>
                      <input
                        type="number"
                        onChange={(e) => handleExerciseChange(exercise.id, exercise.sets, exercise.reps, e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Rest time"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
            Create Workout
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
