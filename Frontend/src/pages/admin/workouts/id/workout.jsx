import { useEffect, lazy, Suspense, useState } from "react"
import { Plus, Loader2, Search, Menu, XCircle, ChevronDown, ChevronRight } from "lucide-react"
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from 'react-router-dom';
import { deleteWorkout, fetchWorkouts, searchWorkouts, setStatus } from "../../../../../store/workoutSlice";
import STATUSES from "../../../../globals/status/statuses";
import {ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { NewWorkoutDayDialog } from '../components/form/new-workoutday'
import {WorkoutDayList} from '../components/card/Workoutdaylist';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/ui/dashboard-shell";


// Error fallback component
function ErrorFallback({ error }) {
  return (
    <div className="text-red-500 text-center p-6 bg-navy-800 rounded-lg">
      <h1 className="font-bold text-xl mb-2">Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}

export default function WorkoutsPage() {
  const { id } = useParams();
  const { status, data: workouts } = useSelector((state) => state.workout);
  const dispatch = useDispatch();
  const numericId = Number(id);
  console.log(numericId)

  // Find the workout data that matches the ID from URL params
  const workoutData = workouts?.find(workout => workout.id === numericId);
  console.log(workoutData)

  useEffect(() => {
    // If we don't have workouts data yet or need to refresh, fetch it
    if (!workouts || workouts.length === 0) {
      dispatch(fetchWorkouts());
    }
  }, [dispatch, workouts]);

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
        No Workout Plan Found
      </p>
      <Link to="/AddWorkout">
        <button className="bg-lime-300 hover:bg-lime-400 text-navy-900 font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 mx-auto">
          <Plus size={18} />
          Add Workout Plan
        </button>
      </Link>
    </div>
  );

  // If we're still loading or workout not found, show appropriate UI
  if (status?.status === STATUSES.LOADING) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!workoutData && workouts?.length > 0) {
    return (
      <DashboardLayout>
        <div className="p-5">Workout with ID {id} not found</div>
      </DashboardLayout>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-5">
      <DashboardLayout>
        <div className="flex-1">
          <DashboardShell>
    
            <Breadcrumb className="mb-5">
            <ToastContainer position="top-right" autoClose={3000} />
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Workout Plans</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <span>{workoutData?.name || 'Workout Plan'}</span>
              </BreadcrumbItem>
            </Breadcrumb>

            <DashboardHeader
              heading={workoutData?.name || 'Workout Plan'}
              text="Manage workout days and exercises."
            >
              <div className="flex space-x-4">
                <Button variant="outline" asChild>
                  <Link to={`/admin/workout/edit/${id}`}>
                    Edit Plan
                  </Link>
                </Button>
                <NewWorkoutDayDialog Dialog id={numericId} />
              </div>
            </DashboardHeader>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSpinner />}>
                {/* Pass both the ID and the workout data to the component */}
                <WorkoutDayList
                  workoutPlanId={numericId}
                  workoutData={workoutData}
                />
              </Suspense>
            </ErrorBoundary>
          </DashboardShell>
        </div>
      </DashboardLayout>
    </div>
  );
}