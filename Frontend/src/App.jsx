import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React, { Suspense, lazy } from "react";
import store from "../store/store.js";
import "./App.css";
import { ErrorBoundary } from "react-error-boundary";
import "@fontsource/inter"; // Defaults to weight 400.
import { ProtectedAdmin, ProtectedUser } from './Protected.jsx';

import { ThemeProvider } from "./components/ui/theme-provider";

// In your App.js or main component file
import AppInitializer from './components/AppInitializer.js';



// Lazy Loading Components
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/forget"));
const Resetword = lazy(() => import("./pages/auth/Reset"));
const Landing = lazy(() => import("./pages/Landing/Landing.jsx"));
const WelcomePage = lazy(() => import("./pages/auth/Components/Welcome.jsx"));
const AddExcercise = lazy(() => import("./pages/admin/excercises/AddExcercise.jsx"));
const UpdateExcercise = lazy(() => import("./pages/admin/excercises/UpdateExcercise.jsx"));
const AddWorkout = lazy(() => import("./pages/admin/workouts/AddWorkout.jsx"));
// const AddExcercise2 = lazy(() => import("./pages/admin/excercises/AddExcercise.jsx"));
const Workouts = lazy(() => import("./pages/admin/workouts/Page.jsx"));
const GenerateWorkoutPage = lazy(() => import("./pages/user/generate/page.jsx"));

const UpdateWorkout = lazy(() => import("./pages/admin/workouts/UpdateWorkout.jsx"));
const Workout = lazy(() => import("./pages/admin/workouts/id/workout.jsx"));
const Plans = lazy(() => import("./pages/user/plans/page.jsx"));
const UserManagement = lazy(() => import("./pages/admin/users/page.jsx"));
const Dashboard = lazy(() => import("./pages/admin/dashboard/page.jsx"));
const Excercise = lazy(() => import("./pages/admin/excercises/Page.jsx"));
const Plans1 = lazy(() => import("./pages/user/plans/id/plans.jsx"));
const UserDashboard = lazy(() => import("./pages/user/dashboard/page.jsx"));
const Schedule = lazy(() => import("./pages/user/schedule/page.jsx"));
const Profile = lazy(() => import("./pages/user/profile/page.jsx"));
const MyWorkoutsPage = lazy(() => import("./pages/user/my-workouts/page.jsx"));
const MyWorkoutsID = lazy(() => import("./pages/user/my-workouts/id/page.jsx"));
const History = lazy(() => import("./pages/user/history/page.jsx"));
const Notifications = lazy(() => import("./pages/user/notifications/page.jsx"));
const AdminNotifications = lazy(() => import("./pages/admin/notifications/page.jsx"));
// const Home = lazy(()=>import("./pages/user/home/page.jsx"))

const Settings = lazy(() => import("./pages/admin/settings/page.jsx"));

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
       <AppInitializer>
      <ThemeProvider defaultTheme="dark" storageKey="fittrack-theme">
     
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<h2 className="text-center">Loading...</h2>}>
              <Routes>

                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/" element={<Landing />} />
                <Route path="/Forgot" element={<ForgotPassword />} />
                <Route path="/Reset" element={<Resetword />} />
                <Route path="/WelcomePage" element={<WelcomePage />} />

                <Route path="/admin/dashboard" element={<ProtectedAdmin><Dashboard /></ProtectedAdmin>} />
                <Route path="/admin/excercise/add" element={<ProtectedAdmin><AddExcercise /></ProtectedAdmin>} />
                <Route path="/admin/excercise" element={<ProtectedAdmin><Excercise /></ProtectedAdmin>} />
                <Route path="/admin/excercise/:id" element={<ProtectedAdmin><UpdateExcercise /></ProtectedAdmin>} />
                <Route path="/admin/workout" element={<ProtectedAdmin><Workouts /></ProtectedAdmin>} />
                <Route path="/admin/workout/add" element={<ProtectedAdmin><AddWorkout /></ProtectedAdmin>} />
                <Route path="/admin/workout/edit/:id" element={<ProtectedAdmin><UpdateWorkout /></ProtectedAdmin>} />
                <Route path="/admin/workout/:id" element={<ProtectedAdmin><Workout /></ProtectedAdmin>} />
                <Route path="/admin/users" element={<ProtectedAdmin><UserManagement /></ProtectedAdmin>} />
                <Route path="/admin" element={<ProtectedAdmin><Dashboard /></ProtectedAdmin>} />
                <Route path="/admin/settings" element={<ProtectedAdmin><Settings /></ProtectedAdmin>} />
                <Route path="/admin/notifications" element={<ProtectedAdmin><AdminNotifications /></ProtectedAdmin>} />
                



                <Route path="/plans" element={<ProtectedUser><Plans /></ProtectedUser>} />
                <Route path="/plan/:id" element={<ProtectedUser><Plans1 /></ProtectedUser>} />
                <Route path="/user" element={<ProtectedUser><UserDashboard /></ProtectedUser>} />
                <Route path="/schedule" element={<ProtectedUser><Schedule /></ProtectedUser>} />
                <Route path="/profile" element={<ProtectedUser><Profile /></ProtectedUser>} />
                <Route path="/MyWorkouts" element={<ProtectedUser><MyWorkoutsPage /></ProtectedUser>} />
                <Route path="/MyWorkoutsID/:id" element={<ProtectedUser><MyWorkoutsID /></ProtectedUser>} />
                <Route path="/History" element={<ProtectedUser><History /></ProtectedUser>} />
                <Route path="/notifications" element={<ProtectedUser><Notifications /></ProtectedUser>} />
                <Route path="/generate" element={<ProtectedUser><GenerateWorkoutPage /></ProtectedUser>} />
                {/* <Route path="/home" element={<Protected><Home /></Protected>} /> */}

              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>

      </ThemeProvider>
      </AppInitializer>
    </Provider>
  );
}

export default App;
