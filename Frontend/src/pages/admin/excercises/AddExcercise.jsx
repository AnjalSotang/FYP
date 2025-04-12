import React, { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addExcercise, setStatus } from "../../../../store/excerciseSlice";
import STATUSES from "../../../globals/status/statuses";  // Adjust path if necessary
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Sidebar from "../../../components/navbar/admin/Sidebar";
import ExerciseForm from "./components/form/ExcerciseForm";

const AddExercise = () => {
  const { status } = useSelector((state) => state.excercise)
  const dispatch = useDispatch()
  // const navigate = useNavigate();

  const handleAddExcercise = (data) => {
    dispatch(addExcercise(data))
  };

  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      // navigate("/");
      toast.success(status.message);
      dispatch(setStatus(null));
    } else if (status?.status === STATUSES.ERROR) {
      toast.error(status.message);
    }
  }, [status]);



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
        <ExerciseForm type= "add" onSubmit={handleAddExcercise} />
        </DashboardLayout>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AddExercise;
