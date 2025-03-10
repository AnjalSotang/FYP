import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React, { Suspense, lazy } from "react";
import store from "../store/store.js";
import "./App.css";
import { ErrorBoundary } from "react-error-boundary";

// Lazy Loading Components
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/forget"));
const Resetword = lazy(() => import("./pages/auth/Reset"));
const Landing = lazy(() => import("./pages/auth/Landing"));
// const UserName = lazy(() => import("./pages/auth/UserName"));
const WelcomePage = lazy(() => import("./pages/auth/Components/Welcome.jsx"));
const AddExcercise = lazy(() => import("./pages/Admin/AddExcercise.jsx"));
const Ex = lazy(() => import("./pages/Admin/CreateWorkout.jsx"));
// const MotivationPage = lazy(() => import("./pages/auth/MotivationPage"));
// const HealthDetaills = lazy(() => import("./pages/auth/HealthDetaills.jsx"));
// const ExperienceForm = lazy(() => import("./pages/auth/ExperienceForm.jsx"));
// const CongratulationsPage = lazy(() => import("./pages/auth/CongratulationsPage.jsx"));

// Error Fallback UI
function ErrorFallback({ error }) {
  return (
    <div className="text-red-500 text-center">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<h2 className="text-center">Loading...</h2>}>
            <Routes>
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/" element={<Landing />} />
              <Route path="/Forgot" element={<ForgotPassword />} />
              <Route path="/Reset" element={<Resetword />} />
              {/* <Route path="/userName" element={<UserName />} /> */}
              <Route path="/WelcomePage" element={<WelcomePage />} />
              <Route path="/AddExcercise" element={<AddExcercise  />} />
              <Route path="/addq" element={<Ex />} />
              {/* <Route path="/Motivation" element={<MotivationPage />} /> */}
              {/* <Route path="/Health" element={<HealthDetaills />} /> */}
              {/* <Route path="/Experience" element={<ExperienceForm />} /> */}
              {/* <Route path="/Congrats" element={<CongratulationsPage />} /> */}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
