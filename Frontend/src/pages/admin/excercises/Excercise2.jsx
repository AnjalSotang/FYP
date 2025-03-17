import React, { useEffect, lazy, Suspense, useState } from 'react';

import { Loader2, Plus, Search, XCircle, ChevronDown } from 'lucide-react';
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { deleteExcercise, fetchExcercises, searchExercises, setStatus } from "../../../../store/excerciseSlice";
import STATUSES from "../../../globals/status/statuses";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Lazy load the card component
const Card = lazy(() => import('./components/card/card2'));

// Error fallback component
function ErrorFallback({ error }) {
  return (
    <div className="text-red-500 text-center p-6 bg-navy-800 rounded-lg">
      <h1 className="font-bold text-xl mb-2">Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}

export default function Exercises2() {
  const { data: exercises, status } = useSelector((state) => state.excercise);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showClear, setShowClear] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Fetch exercises on mount
  useEffect(() => {
    dispatch(fetchExcercises());
  }, [dispatch]);

  // Handle status updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      dispatch(setStatus(null));
    } else if (status?.status === STATUSES.ERROR && status.message) {
      toast.error(status.message);
    }
  }, [status, dispatch]);

  // Handler functions
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      dispatch(deleteExcercise(id));
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(searchExercises(value));
    setShowClear(value.length > 0);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowClear(false);
    dispatch(searchExercises(""));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    // dispatch(filterCategories(category));
  };

  const handleDifficultyChange = (e) => {
    const difficulty = e.target.value;
    setDifficultyFilter(difficulty);
    // dispatch(AllDifficulties(difficulty));
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
      <div className="min-h-screen bg-navy-900 p-4 md:p-8 ">
        {/* Header with search and add button */}
        <div className="mb-5 ">
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">Exercises</h1>
          <p className=" text-gray-400">Manage your exercise library</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 ">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search input */}
            <div className="relative w-full sm:w-70">
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

            {/* Category filter dropdown */}
            <div className="relative w-full sm:w-50">


              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="w-full h-10 pl-4 pr-10 rounded-md bg-[#1a2c50]/50 text-gray-400 appearance-none border-0 focus:outline-none focus:ring-1 focus:ring-[#b4e61d]"
              >
                <option value="all" className="text-gray-400 bg-navy-800">All Categories</option>
                <option value="strength" className="text-gray-400 bg-navy-800">Strength</option>
                <option value="cardio" className="text-gray-400 bg-navy-800">Cardio</option>
                <option value="flexibility" className="text-gray-400 bg-navy-800">Flexibility</option>
                <option value="bodyweight" className="text-gray-400 bg-navy-800">Bodyweight</option>
                <option value="machine" className="text-gray-400 bg-navy-800">Machine</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            {/* Category filter dropdown */}
            <div className="relative w-full sm:w-50">


              <select
                value={difficultyFilter}
                onChange={handleDifficultyChange}
                className="w-full h-10 pl-4 pr-10 rounded-md bg-[#1a2c50]/50 text-gray-400 appearance-none border-0 focus:outline-none focus:ring-1 focus:ring-[#b4e61d]"
              >
                <option value="all" className="text-gray-400 bg-navy-800">All Categories</option>
                <option value="strength" className="text-gray-400 bg-navy-800">Strength</option>
                <option value="cardio" className="text-gray-400 bg-navy-800">Cardio</option>
                <option value="flexibility" className="text-gray-400 bg-navy-800">Flexibility</option>
                <option value="bodyweight" className="text-gray-400 bg-navy-800">Bodyweight</option>
                <option value="machine" className="text-gray-400 bg-navy-800">Machine</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>


          </div>

          {/* Add Exercise button */}
          <Link to="/AddExcercise" className="w-full sm:w-auto">
            <button className="w-full bg-lime-300 hover:bg-lime-400 text-navy-900 font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2">
              <Plus size={18} />
              ADD EXERCISE
            </button>
          </Link>
        </div>

        {/* Exercise Card List - always vertical column layout */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {status?.status === STATUSES.LOADING ? (
            <LoadingSpinner />
          ) : exercises?.length > 0 ? (
            <div className="flex flex-col gap-6">
              <Suspense fallback={<LoadingSpinner />}>
                {exercises.map((exercise) => (
                  <Card
                    key={exercise.id || exercise._id}
                    exercise={exercise}
                    onDelete={handleDelete}
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