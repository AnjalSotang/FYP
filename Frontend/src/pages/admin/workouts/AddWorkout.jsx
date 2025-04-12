import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addWorkout, setStatus } from "../../../../store/workoutSlice";
import STATUSES from "../../../globals/status/statuses";  // Adjust path if necessary
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Sidebar from "../../../components/navbar/admin/Sidebar";

// Update the import to match your actual file name
import WorkoutForm from "./components/form/Form";


const AddExercise = () => {
  const { status } = useSelector((state) => state.workout);
  const workout = useSelector((state) => state.workout);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log("Workout state:", workout);

  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      // Only navigate if this was an add operation
      // navigate("/Workout");
      // toast.success(status.message);
      dispatch(setStatus(null));
      setIsSubmitting(false);
    } else if (status?.status === STATUSES.ERROR) {
      toast.error(status.message);
      dispatch(setStatus(null));
      setIsSubmitting(false);
    }
  }, [status, dispatch, navigate]);

  const handleAddWorkout = (data) => {
    setIsSubmitting(true);
    dispatch(addWorkout(data));
    console.log(data);
  };

  function ErrorFallback({ error }) {
    return (
      <div className="text-red-500 text-center">
        <h1>Something went wrong while adding workout</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div className="spinner">Loading...</div>}>
        <DashboardLayout SidebarComponent={Sidebar}>
          <WorkoutForm 
            type="add" 
            onSubmit={handleAddWorkout} 
            isSubmitting={isSubmitting}
          />
        </DashboardLayout>
      </Suspense>
    </ErrorBoundary>
  );
};

export default React.memo(AddExercise);