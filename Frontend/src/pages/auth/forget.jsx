import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { forget, setStatus } from "../../../store/authSlice";
import STATUSES from "../../globals/status/statuses";
import { toast, ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { user, status } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleRedirect = () => {
    navigate('/Login');
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const newErrors = {}
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(forget(email));
  }, [email, dispatch]);

  const handleReSubmit = (e) => {
    e.preventDefault();
    if(!user.email){
      toast.error("Please enter the email first ")
      return
    }
    dispatch(forget(user.email))
  }

  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      navigate("/Reset");
      dispatch(setStatus(null));
    } else if (status?.status === STATUSES.ERROR) {
      toast.error(status.message);
    }
  }, [status, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1129] to-[#1a2c50] flex items-center justify-center relative">
      {/* FitTrack Logo */}
      <div className="absolute top-6 left-10">
        <h1 className="text-[#b4e61d] text-4xl font-bold tracking-wide hover:text-[#a4d519] transition">
          FitTrack
        </h1>
      </div>

      <ToastContainer position="top-right" autoClose={3000} aria-live="assertive" />


      {/* Forgot Password Form Container */}
      <div className="bg-[#112240] p-12 rounded-2xl shadow-2xl shadow-black/40 w-[480px] hover:shadow-lg transition duration-300">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Forgot Password?
        </h2>

        {/* Subheading */}
        <p className="text-lg text-gray-400 text-center mb-8">
          Enter your email to receive a password reset OTP.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative mb-8">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 pl-12 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
              aria-label="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            {errors.email && <span className='error-message fade-in-error'>{errors.email}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#b4e61d] to-[#a4d519] text-[#112240] text-lg font-bold py-3 rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition duration-300"
          >
            Send OTP
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Didn’t receive the OTP?{" "}
            <button
              className="text-[#4a90e2] font-bold hover:underline cursor-pointer bg-transparent border-none"
              onClick={handleReSubmit}
            >
              Resend OTP
            </button>
          </p>
        </div>


        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            className="text-[#4a90e2] font-bold hover:underline hover:text-[#3b7ac9] transition"
            onClick={handleRedirect}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
