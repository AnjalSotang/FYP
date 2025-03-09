import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import STATUSES from '../../globals/status/statuses';
import { register, setStatus, setUser, setStep } from "../../../store/authSlice";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy-loaded components
const Form = lazy(() => import("./Components/Form"));
const ProfileForm = lazy(() => import("./Components/ProfileForm"));
const Check = lazy(() => import("./Components/Check"));

const Register = () => {
  const { step, status, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleMultipleSelection = (option) => {
    setSelectedOptions((prev) => {
      const newOptions = prev.includes(option)
        ? prev.filter((item) => item !== option) // Remove if already selected
        : [...prev, option]; // Add if not selected
  
      console.log("Updated Selected Options:", newOptions);
      return newOptions; // Ensure state updates properly
    });
  };
  
  // 🔥 Single Selection for Step 5 (Updates Redux)
  const handleSingleSelection = (option) => {
    dispatch(setUser({ ...user, experienceLevel: option }));
  };

  const handleNextStep = (data) => {
    // Only merge the fields that are present in the form data
    const updatedData = {
      ...user, // Keep all previous user state
      ...Object.keys(data).reduce((acc, key) => {
        if (data[key] !== "") {
          acc[key] = data[key]; // Only update if data is not empty
        }
        return acc;
      }, {}),
    };
    
    // Dispatch the updated user state
    dispatch(setUser(updatedData));
    dispatch(setStep(step + 1));
  };
  
  useEffect(() => {
    console.log("Updated User:", user);
  }, [user]);
  
  useEffect(() => {
    console.log("Updated Step:", step);
  }, [step]);
  
  // 🔥 Sync URL step with Redux
  useEffect(() => {
    const stepFromURL = Number(searchParams.get("step"));
    if (stepFromURL) dispatch(setStep(stepFromURL));
  }, [searchParams, dispatch]);

  // 🔥 Navigation logic
  useEffect(() => {
    if (step === 2) navigate("/WelcomePage");
  }, [step, navigate]);

  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      navigate("/login");
      dispatch(setStatus(null));
    } else if (status?.status === STATUSES.ERROR) {
      toast.error(status.message);
    }
  }, [status, dispatch, navigate]);

  // Options for Step 3
  const options = [
    "I am a beginner and I want guidance",
    "I am interested in improving my training split",
    "I want an optimal workout plan based on my goals",
  ];

  // Options for Step 5
  const optionsExp = ["Beginner", "Intermediate", "Advanced"];

  
  const handleRegister = (data) => {
    const updatedUser = { ...user, ...data }; // Merge existing user data with new form input
    dispatch(setUser(updatedUser)); // First, update Redux state
    dispatch(register(updatedUser)); // Then, register using the updated data
  };
  


  return (
    <ErrorBoundary FallbackComponent={({ error }) => (
      <div className="text-red-500 text-center">
        <h1>Something went wrong</h1>
        <p>{error.message}</p>
      </div>
    )}>
      <Suspense fallback={<div className="text-white text-center text-lg">Loading Form...</div>}>
        {step === 1 && <ProfileForm type="userName" onNext={handleNextStep} />}

        {/* Step 3: Multiple Selection */}
        {step === 3 && (
  <div className="flex justify-center items-center h-screen w-screen bg-[#0b1129]">
    <Check
      title="Why do you want to use this web app?"
      subtitle="Let us understand your goals!"
      options={options}
      selectedOptions={selectedOptions}
      toggleOption={handleMultipleSelection}
      buttonText="Next"
      nextLink="/register?step=4"
    />
  </div>
)}


        {step === 4 && <ProfileForm type="Health" onNext={handleNextStep} />}

        {/* Step 5: Single Selection */}
        {step === 5 && (
         <div className="flex justify-center items-center h-screen w-screen bg-[#0b1129]">
          <Check
            title="How experienced are you lifting weights?"
            subtitle="This will help us recommend the right exercises and weights for you."
            options={optionsExp}
            selectedOption={user.experienceLevel}
            toggleOption={handleSingleSelection}
            buttonText="Next"
            nextLink="/register?step=6" 
          />
          </div>
        )}


        {/* Step 6: Final Registration Form */}
        {step === 6 && <Form type="register" onSubmit={handleRegister} />}
      </Suspense>
    </ErrorBoundary>
  );
};

export default Register;
