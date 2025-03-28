import { useEffect, lazy, Suspense, useState } from "react"
import { Plus, Loader2, Search, Menu, XCircle, ChevronDown } from "lucide-react"
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { deleteWorkout, fetchWorkouts, searchWorkouts, setStatus } from "../../../../store/workoutSlice";
import STATUSES from "../../../globals/status/statuses";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Lazy load the card component
const Card = lazy(() => import('./components/card/workoutCard'))

// Error fallback component
function ErrorFallback({ error }) {
  return (
    <div className="text-red-500 text-center p-6 bg-navy-800 rounded-lg">
      <h1 className="font-bold text-xl mb-2">Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}

// Using the requested color theme
export default function WorkoutsPage() {
  const dispatch = useDispatch();

  // Fix: More robust state access with additional safety checks
  const {data: workouts, status} = useSelector((state) => state.workout);

  const [searchTerm, setSearchTerm] = useState("");
  const [showClear, setShowClear] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");


console.log(workouts)


  // Fetch exercises on mount
  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  // Handle status updates
  useEffect(() => {
    if ( status?.status === STATUSES.SUCCESS) {
      dispatch(setStatus(null));
    } 
  }, [status, dispatch]);

  // Handler functions
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      dispatch(deleteWorkout(id));
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(searchWorkouts(value, categoryFilter));
    setShowClear(value.length > 0);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowClear(false);
    dispatch(fetchWorkouts()); // Reset to show all workouts
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    // Dispatch based on the selected category
    if (category === "All") {
      dispatch(fetchWorkouts());  // This will fetch all workouts without a level filter
    } else {
      dispatch(searchWorkouts(searchTerm, category));
    }
  };



  // Loading state component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-lime-300 animate-spin" />
    </div>
  );


  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12 /rounded-lg">
      <p className="text-xl text-gray-400 mb-4">
        No Workoutp Plan Found
      </p>
      <Link to="/AddWorkout">
        <button className="bg-lime-300 hover:bg-lime-400 text-navy-900 font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 mx-auto">
          <Plus size={18} />
          Add Workout Plan
        </button>
      </Link>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 md:p-8 ">
        {/* Header with search and add button */}
        <div className="mb-5 ">
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">Workout Plans</h1>
          <p className=" text-gray-400 font-semibold">Manage workout plan for your users</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-5/12">
            {/* Search input */}
            <div className="relative w-full sm:w-100">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search Plans..."
                className="w-full h-12 pl-10 pr-10 rounded-lg bg-[#1a2c50]/50 text-white placeholder:text-gray-400 border-0 focus:outline-none focus:ring-1 focus:ring-[#b4e61d]"
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
            <div className="relative w-full sm:w-60">
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="w-full h-12 pl-4 pr-10 rounded-lg bg-[#1a2c50]/50 text-gray-400 appearance-none border-0 focus:outline-none focus:ring-1 focus:ring-[#b4e61d]"
              >
                <option value="All" className="text-gray-400 bg-navy-800">All</option>
                <option value="Beginner" className="text-gray-400 bg-navy-800">Beginner</option>
                <option value="Intermediate" className="text-gray-400 bg-navy-800">Intermediate</option>
                <option value="Advanced" className="text-gray-400 bg-navy-800">Advanced</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

          </div>

          {/* Add Exercise button */}
          <Link to="/AddWorkout" className="w-full sm:w-auto">
            <button className="w-full bg-lime-300 hover:bg-lime-400 text-navy-900 font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-3">
              <Plus size={18} />
              ADD Workout Plan
            </button>
          </Link>
        </div>


        {/* Exercise Card List - always vertical column layout */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {status?.status === STATUSES.LOADING ? (
            <LoadingSpinner />
          ) : workouts?.length > 0 ? (
            <div className="flex flex-col gap-6">
              <Suspense fallback={<LoadingSpinner />}>
                <Card
                  workouts={workouts}
                  onDelete={handleDelete}
                />
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