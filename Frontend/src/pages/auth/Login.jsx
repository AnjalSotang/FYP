import React, { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, setStatus } from "../../../store/authSlice";
import STATUSES from "../../globals/status/statuses";  // Adjust path if necessary
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Form = lazy(() => import("./Components/Form"));

const Login = () => {
  const { user, status } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const handleLogin = (data) => {
    dispatch(login(data))
  };

  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      navigate("/");
      dispatch(setStatus(null));
    } else if (status?.status === STATUSES.ERROR) {
      toast.error(status.message);
    }
  }, [status]);



  function ErrorFallback({ error }) {
    return (
      <div className="text-red-500 text-center">
        <h1>Something went wrong login</h1>
        <p>{error.message}</p>
      </div>
    );
  }


  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div className="text-white text-center text-lg">Loading Form...</div>}>
        <Form type="login" user={user} onSubmit={handleLogin} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default React.memo(Login);
