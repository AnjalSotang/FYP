import React, { useEffect, lazy, Suspense, useState } from 'react';
import { Loader2, Plus, Search, XCircle, CheckSquare } from 'lucide-react';
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { deleteExcercise, fetchExcercises, searchExercises, setStatus } from "../../../../store/excerciseSlice";

import STATUSES from "../../../globals/status/statuses";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { addExerciseToWorkout, setStatus1, setWorkoutExercises } from '../../../../store/workoutExcerciseSlice';

// Lazy load the card component
const ExcerciseCard = lazy(() => import('./components/card/card'));

// Error fallback component
function ErrorFallback({ error }) {
  return (
    <div className="text-red-500 text-center p-6 bg-navy-800 rounded-lg">
      <h1 className="font-bold text-xl mb-2">Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}

export default function AddExcercise2() {
  const navigate = useNavigate();
  const { data1: workoutData } = useSelector((state) => state.workout);
  const { status: nt} = useSelector((state) => state.workoutExercise);  
  const { data: exercises, status } = useSelector((state) => state.excercise);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showClear, setShowClear] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isWorkoutInProgress, setIsWorkoutInProgress] = useState(false);

// Log the workout data to verify its structure
if (!workoutData) {
  toast.error("Workout ID is missing! Please try again.");
  return; // Stop execution if ID is null
}

// If workoutData is populated, get the ID of the latest workout (the last item in the array)
const latestWorkoutId = workoutData.id;

if (!latestWorkoutId) {
  toast.error("Workout ID is missing! Please try again.");
  return; // Stop execution if ID is null
}
console.log(latestWorkoutId)

  // Add this useEffect after your other useEffect hooks
  useEffect(() => {
    // Only fetch if we don't already have exercises and aren't currently loading
    if (!exercises.length && status !== STATUSES.LOADING) {
      dispatch(fetchExcercises());
    }
  }, [dispatch, exercises.length, status]);


  // Handle status updates
  useEffect(() => {
    if (status?.status  === STATUSES.SUCCESS) {
      dispatch(setStatus(null));
    } else if (status?.status === STATUSES.ERROR && status.message) {
      toast.error(status.message);
    }
  }, [status, dispatch]);

    // Handle status updates
    useEffect(() => {
      if (nt?.status  === STATUSES.SUCCESS) {
        dispatch(setStatus1(null));
        // dispatch(setWorkoutExercises([]));
      } else if (nt?.status === STATUSES.ERROR && nt.message) {
        toast.error(nt.message);
      }
    }, [nt, dispatch]);
  


// Handle adding exercise to workout
const handleAddExerciseToWorkout = (exerciseData) => {
  // Add exercise to workout and keep internal state (but don't update the list UI directly)
  const updatedExercises = [...selectedExercises, exerciseData];
  setSelectedExercises(updatedExercises);
  setIsWorkoutInProgress(true);

  // Save to localStorage for persistence between page refreshes
  localStorage.setItem('workoutExercises', JSON.stringify(updatedExercises));

  console.log(exerciseData)
  const { exerciseName, ...validExerciseData } = exerciseData;
console.log(validExerciseData);  
  // Dispatch action to add exercise to the workout
  dispatch(addExerciseToWorkout(validExerciseData));
  console.log(exerciseData)

  // toast.success(`Added ${exerciseData.exerciseName} to workout!`);

};
  // // Handler functions
  // const handleDelete = (id) => {
  //   if (window.confirm("Are you sure you want to delete this exercise?")) {
  //     dispatch(deleteExcercise(id));
  //   }
  // };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(searchExercises(value));
    setShowClear(value.length > 0);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowClear(false);
    dispatch(fetchExcercises());
  };

    // Navigate to workout summary
    const handleFinishWorkout = () => {
      if (selectedExercises.length === 0) {
        toast.warning("Please add at least one exercise to your workout first!");
        return;
      }
  
      // Navigate to workout summary page
      navigate('/workout-summary');
    };

    
  // Loading state component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-lime-300 animate-spin" />
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12 bg-navy-800 rounded-lg">
      <p className="text-xl text-gray-400 mb-4">
        No exercises found
      </p>
      <Link to="/AddExcercise">
        <button className="bg-lime-300 hover:bg-lime-400 text-navy-900 font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 mx-auto">
          <Plus size={18} />
          Add Your First Exercise
        </button>
      </Link>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-navy-900 p-4 md:p-8">
        {/* Header with search, add button and workout status */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-10 rounded-md bg-[#1a2c50]/50 text-white placeholder:text-gray-400 border-0 focus:outline-none focus:ring-1 focus:ring-[#b4e61d]"
            />
            {showClear && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>

         
        </div>

        {/* Workout Status Bar */}
        {isWorkoutInProgress && (
          <div className="bg-navy-800 p-4 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-3 sm:mb-0">
              <div className="w-2 h-2 bg-lime-300 rounded-full mr-2 animate-pulse"></div>
              <span className="text-white font-medium">
                Workout in progress: {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={handleFinishWorkout}
              className="bg-lime-300 hover:bg-lime-400 text-navy-900 font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <CheckSquare size={18} />
              FINISH & REVIEW WORKOUT
            </button>
          </div>
        )}

        {/* Exercise Card List - always vertical column layout */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {status?.status === STATUSES.LOADING ? (
            <LoadingSpinner />
          ) : exercises?.length > 0 ? (
            <div className="flex flex-col gap-6">
              <Suspense fallback={<LoadingSpinner />}>
                {exercises.map((exercise) => (
                  <ExcerciseCard
                    key={exercise.id || exercise._id}
                    exercise={exercise}
                    // onDelete={handleDelete}
                    latestWorkoutId={latestWorkoutId}
                    onAddToWorkout={handleAddExerciseToWorkout}
                  />
                ))}
              </Suspense>
            </div>
          ) : (
            <EmptyState />
          )}
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
}