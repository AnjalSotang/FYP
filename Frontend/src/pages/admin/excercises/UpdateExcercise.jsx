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


const AddExerciseForm = lazy(() => import("./components/form/Form"));

const AddExercise = () => {
  const { id } = useParams();  // Get the exercise id from the URL
  const { status, data: exercises } = useSelector((state) => state.excercise); // Access exercises from Redux state
  const dispatch = useDispatch()
  const navigate = useNavigate();

  // Find the exercise by id in the Redux store
  const exerciseData = exercises.find(exercise => exercise.id === id);

  const handleUpdateExcercise = (formData) => {
    dispatch(updateExcercise(formData)); // formData would be a FormData object
  };


  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      navigate("/Excercise2");
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
          <AddExerciseForm type='update' onSubmit={handleUpdateExcercise} initialData={exerciseData} id={id} />
        </DashboardLayout>
      </Suspense>
    </ErrorBoundary>
  );
};

export default React.memo(AddExercise);
