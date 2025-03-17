import { useEffect, lazy, Suspense, useState } from "react"
import { Plus, Loader2, Search, Menu, XCircle } from "lucide-react"
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { deleteWorkout, fetchWorkouts, searchWorkouts, setStatus } from "../../../../store/workoutSlice";
import STATUSES from "../../../globals/status/statuses";
import { toast } from "react-toastify";
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
    const workoutState = useSelector((state) => {
        // Check if state and state.workout exist
        if (!state || !state.workout) {
            return { data: [], status: {} };
        }
        return state.workout;
    });
    
    // Extra safety: ensure workouts is always an array
    const workouts = Array.isArray(workoutState.data) ? workoutState.data : [];
    const status = workoutState.status || {};
    
    const [searchTerm, setSearchTerm] = useState("");
    const [showClear, setShowClear] = useState(false);

    // Fetch exercises on mount
    useEffect(() => {
        try {
            dispatch(fetchWorkouts());
        } catch (error) {
            console.error("Error fetching workouts:", error);
            toast.error("Failed to fetch workouts. Please try again later.");
        }
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
            dispatch(deleteWorkout(id));
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        dispatch(searchWorkouts(value));
        setShowClear(value.length > 0);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setShowClear(false);
        dispatch(fetchWorkouts()); // Reset to show all workouts
    };

    // Loading state component
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-lime-300 animate-spin" />
        </div>
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-navy-900 text-white">
                <div className="container mx-auto py-8 px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Chest Workouts</h1>
                    </div>

                    {/* Header with search and add button */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 ">
                        <div className="relative w-full sm:w-72">
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

                        <Link to="/AddWorkout" className="w-full sm:w-auto">
                            <button className="w-full bg-lime-300 hover:bg-lime-400 text-navy-900 font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Workout
                            </button>
                        </Link>
                    </div>
                    {/* Exercise Card List - always vertical column layout */}
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        {status?.status === STATUSES.LOADING ? (
                            <LoadingSpinner />
                        ) : workouts.length > 0 ? (
                            <div className="flex flex-col space-y-4 w-full">
                                <Suspense fallback={<LoadingSpinner />}>
                                    {workouts.map((workout) => (
                                        <Card
                                            key={workout.id || workout._id}
                                            workout={workout}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </Suspense>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">No workouts found. Create your first workout!</p>
                            </div>
                        )}
                    </ErrorBoundary>
                </div>
            </div>
        </DashboardLayout>
    );
}