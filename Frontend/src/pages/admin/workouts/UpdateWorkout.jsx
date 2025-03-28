import React, { lazy, Suspense, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStatus, updateWorkout } from "../../../../store/workoutSlice";
import STATUSES from "../../../globals/status/statuses";  // Adjust path if necessary
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Sidebar from "../../../components/navbar/Sidebar";


const WorkoutForm = lazy(() => import("./components/form/Form"));

const UpdateWorkout = () => {
  const { id } = useParams();  // Get the exercise id from the URL
  const { status, data: workout } = useSelector((state) => state.workout);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [workoutData, setWorkoutData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Find the workout data when the component mounts or workout data changes
    if (workout && workout.length > 0) {
      const found = workout.find(item => item.id === Number(id));
      setWorkoutData(found);
    }
  }, [workout, id]);


  // Ensure both id and workout.id are numbers
  // const workoutData = workout.find(workout => workout.id === Number(id)); // Convert id to number

  // if (!workoutData) {
  //   return <div>Workout not found</div>;
  // }


  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS && status?.type === 'update') {
      navigate("/Workout");
      toast.success(status.message);
      dispatch(setStatus(null));
      setIsSubmitting(false);
    } else if (status?.status === STATUSES.ERROR) {
      toast.error(status.message);
      dispatch(setStatus(null));
      setIsSubmitting(false);
    }
  }, [status, dispatch, navigate]);

  const handleUpdateWorkout = (formData) => {
    setIsSubmitting(true);
    dispatch(updateWorkout(formData)); // formData would be a FormData object
  };



  if (!workout || workout.length === 0) {
    return <div>Loading...</div>;
  }

  if (!workoutData) {
    return <div>Workout not found</div>;
  }

  function ErrorFallback({ error }) {
    return (
      <div className="text-red-500 text-center">
        <h1>Something went wrong while adding excercise</h1>
        <p>{error.message}</p>
      </div>
    );
  }


  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div className="spinner">Loading...</div>}>
        <DashboardLayout SidebarComponent={Sidebar}>
          <WorkoutForm id={id} type='update' onSubmit={handleUpdateWorkout} initialData={workoutData} />
        </DashboardLayout>
      </Suspense>
    </ErrorBoundary>
  );
};

export default React.memo(UpdateWorkout);
