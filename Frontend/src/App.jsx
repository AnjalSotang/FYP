import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React, { Suspense, lazy } from "react";
import store from "../store/store.js";
import "./App.css";
import { ErrorBoundary } from "react-error-boundary";
import "@fontsource/inter"; // Defaults to weight 400.
import Protected from './Protected.jsx'


// Lazy Loading Components
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/forget"));
const Resetword = lazy(() => import("./pages/auth/Reset"));
const Landing = lazy(() => import("./pages/auth/Landing"));
// const UserName = lazy(() => import("./pages/auth/UserName"));
const WelcomePage = lazy(() => import("./pages/auth/Components/Welcome.jsx"));
const AddExcercise = lazy(() => import("./pages/admin/excercises/AddExcercise.jsx"));
// const Excercise = lazy(() => import("./pages/excercise/Excercise.jsx"));
const Excercise2 = lazy(() => import("./pages/admin/excercises/Excercise2.jsx"));
const UpdateExcercise = lazy(() => import("./pages/admin/excercises/UpdateExcercise.jsx"));
const AddWorkout = lazy(() => import("./pages/admin/workouts/AddWorkout.jsx"));
const AddExcercise2 = lazy(() => import("./pages/admin/excercises/AddExcercise.jsx"));
const Workouts = lazy(() => import("./pages/admin/workouts/Workout.jsx"));
const Workouts1 = lazy(() => import("./pages/admin/workouts/Workout1.jsx"));

const UpdateWorkout = lazy(() => import("./pages/admin/workouts/UpdateWorkout.jsx"));
const Workout = lazy(() => import("./pages/admin/workouts/id/workout.jsx"));
const Plans = lazy(() => import("./pages/user/plans/page.jsx"));
const UserManagementLoading = lazy(() => import("./pages/admin/users/loading.jsx"));
const UserManagemen = lazy(() => import("./pages/admin/users/page.jsx"));
const Dashboard = lazy(() => import("./pages/admin/dashboard.jsx"));
const Excercise = lazy(() => import("./pages/admin/excercises/Excercise.jsx"));
const Plans1 = lazy(() => import("./pages/user/plans/id/plans.jsx"));
const UserDashboard = lazy(() => import("./pages/user/dashboard/page.jsx"));
const Profile = lazy(() => import("./pages/user/profile/page.jsx"));
const Schedule = lazy(() => import("./pages/user/schedule/page.jsx"));
const Schedule1= lazy(() => import("./pages/user/schedule/page1.jsx"));
const Profile1 = lazy(() => import("./pages/user/profile/page1.jsx"));
const MyWorkoutsPage = lazy(() => import("./pages/user/my-workouts/page.jsx"));
const MyWorkoutsPage1 = lazy(() => import("./pages/user/my-workouts/page1.jsx"));
const MyWorkoutsID = lazy(() => import("./pages/user/my-workouts/id/page.jsx"));





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
              <Route path="/Landing" element={<Landing />} />
              <Route path="/Forgot" element={<ForgotPassword />} />
              <Route path="/Reset" element={<Resetword />} />
              {/* <Route path="/userName" element={<UserName />} /> */}
              <Route path="/WelcomePage" element={<WelcomePage />} />
              <Route path="/AddExcercise" element={<AddExcercise  />} />
              <Route path="/admin/Excercise" element={<Excercise  />} />
              <Route path="/Ex" element={<Excercise2  />} />
              <Route path="/edit/:id" element={<UpdateExcercise />} />
              <Route path="/AddWorkout" element={<AddWorkout  />} />
              <Route path="/AddExcercise2" element={<AddExcercise2  />} />
              <Route path="/Workout" element={<Workouts  />} />
              <Route path="/UpdateWorkout/:id" element={<UpdateWorkout  />} />
              <Route path="/Workout/:id" element={<Workout/>} />
              <Route path="/" element={<Plans/>} />
              <Route path="/admin/users/loading" element={<UserManagementLoading/>} />
              <Route path="/admin/users" element={<UserManagemen/>} />
              <Route path="/admin" element={<Dashboard/>} />
              <Route path="/admin/workout" element={<Workouts1/>} />
              <Route path="/user/Plan/:id" element={<Plans1/>} />
              <Route path="/user" element={<UserDashboard/>} />
              <Route path="/user/profile" element={<Protected><Profile/></Protected>} />
              <Route path="/user/Schedule" element={<Schedule/>} />
              <Route path="/user/Schedule1" element={<Schedule1/>} />
              <Route path="/profile1" element={<Protected><Profile1/></Protected>} />
              <Route path="/MyWorkouts" element={<Protected><MyWorkoutsPage/></Protected>} />
              <Route path="/MyWorkouts1" element={<Protected><MyWorkoutsPage1/></Protected>} />
              <Route path="/MyWorkoutsID/:id" element={<Protected><MyWorkoutsID/></Protected>} />

              {/* <Route path="/addq" element={<Ex />} /> */}
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
