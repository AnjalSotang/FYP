import React, { lazy, Suspense, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStatus, updateExcercise } from "../../../../store/excerciseSlice";
import STATUSES from "../../../globals/status/statuses";  // Adjust path if necessary
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Sidebar from "../../../components/navbar/Sidebar";
import { CloudFog } from "lucide-react";


const ExerciseForm = lazy(() => import("./components/form/ExcerciseForm"));

const UpdateExercise = () => {
  const { id } = useParams();  // Get the exercise id from the URL
  const { status, data } = useSelector((state) => state.excercise); // Access exercises from Redux state
  const dispatch = useDispatch()
  const navigate = useNavigate();
  console.log(id)

  if (!data || data.length === 0) {
    return <div>Loading...</div>;  // Show a loading state while fetching data
  }

    // Ensure both id and workout.id are numbers
    const excerciseData = data.find(data => data.id === Number(id)); // Convert id to number

    if (!excerciseData) {
      return <div>Workout not found</div>;
    }
  console.log(excerciseData);

  const handleUpdateExcercise = (formData) => {
    dispatch(updateExcercise(formData)); // formData would be a FormData object
  };


  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      navigate("/");
      toast.success(status.message);
      dispatch(setStatus(null));
    } else if (status?.status === STATUSES.ERROR) {
      toast.error(status.message);
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
          <ExerciseForm type='update' onSubmit={handleUpdateExcercise} initialData={excerciseData} id={id} />
        </DashboardLayout>
      </Suspense>
    </ErrorBoundary>
  );
};

export default React.memo(UpdateExercise);
