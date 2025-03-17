import React, { lazy, Suspense, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStatus, updateWorkout } from "../../../store/workoutSlice";
import STATUSES from "../../globals/status/statuses";  // Adjust path if necessary
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/sidebar/Sidebar";


const WorkoutForm = lazy(() => import("./components/form/Form"));

const UpdateWorkout = () => {
  const { id } = useParams();  // Get the exercise id from the URL
  const { status, data: workout } = useSelector((state) => state.workout);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  if (!workout || workout.length === 0) {
    return <div>Loading...</div>;  // Show a loading state while fetching data
  }


  // Ensure both id and workout.id are numbers
  const workoutData = workout.find(workout => workout.id === Number(id)); // Convert id to number

  if (!workoutData) {
    return <div>Workout not found</div>;
  }

  console.log(workoutData);

  const handleUpdateWorkout = (formData) => {
    dispatch(updateWorkout(formData)); // formData would be a FormData object
  };


  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      navigate("/Workout");
      toast.success(status.message);
      dispatch(setStatus(null));
    } else if (status?.status === STATUSES.ERROR) {
      toast.error(status.message);
      dispatch(setStatus(null));
    }
  }, [status, dispatch, navigate]);



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
