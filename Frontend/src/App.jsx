import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React, { Suspense, lazy } from "react";
import store from "../store/store.js";
import "./App.css";
import { ErrorBoundary } from "react-error-boundary";
import "@fontsource/inter"; // Defaults to weight 400.
import Protected from './Protected.jsx'
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

                <Route path="/admin/dashboard" element={<Protected><Dashboard /></Protected>} />
                <Route path="/admin/excercise/add" element={<Protected><AddExcercise /></Protected>} />
                <Route path="/admin/excercise" element={<Protected><Excercise /></Protected>} />
                <Route path="/admin/excercise/:id" element={<Protected><UpdateExcercise /></Protected>} />
                <Route path="/admin/workout" element={<Protected><Workouts /></Protected>} />
                <Route path="/admin/workout/add" element={<Protected><AddWorkout /></Protected>} />
                <Route path="/admin/workout/edit/:id" element={<Protected><UpdateWorkout /></Protected>} />
                <Route path="/admin/workout/:id" element={<Protected><Workout /></Protected>} />
                <Route path="/admin/users" element={<Protected><UserManagement /></Protected>} />
                <Route path="/admin" element={<Protected><Dashboard /></Protected>} />
                <Route path="/admin/settings" element={<Protected><Settings /></Protected>} />
                <Route path="/admin/notifications" element={<Protected><AdminNotifications /></Protected>} />
                



                <Route path="/plans" element={<Protected><Plans /></Protected>} />
                <Route path="/plan/:id" element={<Protected><Plans1 /></Protected>} />
                <Route path="/user" element={<Protected><UserDashboard /></Protected>} />
                <Route path="/schedule" element={<Protected><Schedule /></Protected>} />
                <Route path="/profile" element={<Protected><Profile /></Protected>} />
                <Route path="/MyWorkouts" element={<Protected><MyWorkoutsPage /></Protected>} />
                <Route path="/MyWorkoutsID/:id" element={<Protected><MyWorkoutsID /></Protected>} />
                <Route path="/History" element={<Protected><History /></Protected>} />
                <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
                <Route path="/generate" element={<Protected><GenerateWorkoutPage /></Protected>} />

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
