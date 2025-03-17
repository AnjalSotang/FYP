import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Plus, Minus, Check } from 'lucide-react';

const ExerciseCard = ({ exercise, latestWorkoutId, onAddToWorkout }) => {
  const navigate = useNavigate();
  // const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingToWorkout, setIsAddingToWorkout] = useState(false);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  
  // Handle delete with loading state
  // const handleDelete = () => {
  //   setIsDeleting(true);
  //   onDelete(exercise.id || exercise._id);
  //   console.log(exercise.id);
  //   setTimeout(() => setIsDeleting(false), 1000);
  // };

  // Fix image path handling
  const imageUrl = exercise?.imagePath ? exercise.imagePath.replace(/\\/g, "/") : "";

  // Toggle add to workout form
  const toggleAddToWorkout = () => {
    setIsAdding(!isAdding);
  };

  // Handle sets and reps adjustments
  const incrementSets = () => setSets(prev => prev + 1);
  const decrementSets = () => setSets(prev => prev > 1 ? prev - 1 : 1);
  const incrementReps = () => setReps(prev => prev + 1);
  const decrementReps = () => setReps(prev => prev > 1 ? prev - 1 : 1);

// Add exercise to workout
const addToWorkout = async () => {
  if (!latestWorkoutId) {
    toast.error("No active workout found. Please create one first.");
    navigate('/create-workout'); // Fixed: use navigate instead of history.push
    return;
  }

  setIsAddingToWorkout(true);
  
  try {
    // Create the exercise workout data object
    const workoutExerciseData = {
      WorkoutId: latestWorkoutId,
      ExcerciseId: exercise.id || exercise._id,
      sets: sets,
      reps: reps,
      exerciseName: exercise.name // Add this for the parent toast notification
    };
    
    // Call the parent component's function
    const success = await onAddToWorkout(workoutExerciseData);

    if (success) {
      // Reset the workoutExerciseData after successful add
      workoutExerciseData.WorkoutId = "";
      workoutExerciseData.ExcerciseId = "";
      workoutExerciseData.sets = "";
      workoutExerciseData.reps = "";
      workoutExerciseData.exerciseName = ""; // Reset exercise name
    }

    setIsAddingToWorkout(false);
    setIsAdding(false);
  } catch (error) {
    toast.error("Failed to add exercise to workout");
    setIsAddingToWorkout(false);
  }
};


  return (
    <div className="bg-navy-800 rounded-lg">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-navy-800 p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="p-1 rounded-lg w-24 h-24 flex items-center justify-center overflow-hidden shadow-sm">
            {imageUrl ? (
              <img
                src={`http://localhost:3001/${imageUrl}`}
                alt={`${exercise.name} illustration`}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="text-gray-400 text-xs font-medium flex items-center justify-center h-full">
                <svg className="w-4 h-4 mr-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                No image
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-white text-lg font-bold mb-1">{exercise.name}</h2>
            <div className="space-y-0.5">
              <p className="text-gray-300 flex items-center">
                <span className="text-lime-300 font-medium text-xs mr-1">Category:</span> 
                <span className="bg-navy-700 px-2 py-0.5 rounded-full text-white text-xs">{exercise.category}</span>
              </p>
              <p className="text-gray-300 flex items-center">
                <span className="text-lime-300 font-medium text-xs mr-1">Primary Muscle:</span> 
                <span className="bg-navy-700 px-2 py-0.5 rounded-full text-white text-xs">{exercise.muscle_group}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          
          <button 
            className="bg-lime-300 hover:bg-lime-400 text-navy-900 font-medium py-1.5 px-4 rounded-md transition-colors shadow-sm flex items-center justify-center text-sm"
            onClick={toggleAddToWorkout}
          >
            <Plus size={16} className="mr-1" />
            ADD TO WORKOUT
          </button>
        </div>
      </div>
      
      {/* Add to workout form */}
      {isAdding && (
        <div className="p-4 pt-0">
          <div className="bg-navy-700 p-4 rounded-md mt-2">
            <h3 className="text-white font-medium mb-3">Add to Current Workout</h3>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <label className="block text-gray-300 text-sm mb-1">Sets</label>
                <div className="flex items-center">
                  <button 
                    onClick={decrementSets} 
                    className="bg-navy-600 text-white p-1 rounded-l-md hover:bg-navy-500"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="bg-navy-800 text-white px-4 py-1">{sets}</span>
                  <button 
                    onClick={incrementSets} 
                    className="bg-navy-600 text-white p-1 rounded-r-md hover:bg-navy-500"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 ml-4">
                <label className="block text-gray-300 text-sm mb-1">Reps</label>
                <div className="flex items-center">
                  <button 
                    onClick={decrementReps} 
                    className="bg-navy-600 text-white p-1 rounded-l-md hover:bg-navy-500"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="bg-navy-800 text-white px-4 py-1">{reps}</span>
                  <button 
                    onClick={incrementReps} 
                    className="bg-navy-600 text-white p-1 rounded-r-md hover:bg-navy-500"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setIsAdding(false)}
                className="bg-navy-600 hover:bg-navy-500 text-white px-4 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              
              <button 
                onClick={addToWorkout}
                disabled={isAddingToWorkout}
                className={`${isAddingToWorkout ? 'bg-gray-500' : 'bg-lime-300 hover:bg-lime-400'} text-navy-900 font-medium px-4 py-2 rounded-md text-sm flex items-center`}
              >
                {isAddingToWorkout ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-navy-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-1" />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;