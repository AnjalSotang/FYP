import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { reset, setStatus } from "../../../store/authSlice";
import STATUSES from "../../globals/status/statuses";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const {user, status} = useSelector((state) => state.auth);
  const [data, setData] = useState({
    email: user?.email || "",
    otp: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target; 
    setData((prevData)=> ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const {otp, password, confirmPassword} = data;
    const newErrors = {};
    if (!otp.trim()) {
      newErrors.otp = "Please Enter the OTP";
    }
    if (!password) {
      newErrors.password = "Please Enter The New Password";
    }
    if (password.length < 8) {
      newErrors.password = "Password must be more than 8 characters.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please Confirm The New Password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setIsSubmitting(true);
    toast.info("Processing your request...", { autoClose: false, toastId: "reset-password" });
    dispatch(reset(data));
  };

  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      setIsSubmitting(false);
      toast.dismiss("reset-password");
      toast.success("Password reset successful! Redirecting to login page...");
      
      // Short delay to allow the toast to be seen before navigation
      setTimeout(() => {
        navigate("/login");
        dispatch(setStatus(null));
      }, 3000);
    } else if (status?.status === STATUSES.ERROR) {
      setIsSubmitting(false);
      toast.dismiss("reset-password");
      toast.error(status.message);
    }
  }, [status, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1129] to-[#1a2c50] flex items-center justify-center relative">
      {/* FitTrack Logo */}
      <div className="absolute top-8 left-12">
        <h1 className="text-[#b4e61d] text-4xl font-bold tracking-wide hover:text-[#a4d519] transition">
          FitTrack
        </h1>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Reset Password Form Container */}
      <div className="bg-[#112240] p-12 rounded-2xl shadow-2xl shadow-black/40 w-[500px] hover:shadow-lg transition duration-300">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Reset Password
        </h2>

        <p className="text-lg text-gray-400 text-center mb-8">
          Enter the OTP sent to your email and set a new password.
        </p>

        <form onSubmit={handleSubmit}>
          {/* OTP Input */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-4 pl-4 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
              aria-label="Enter OTP"
              name="otp"
              onChange={handleChange}
              value={data.otp}
              disabled={isSubmitting}
            />
            {errors.otp && <span className='error-message fade-in-error'>{errors.otp}</span>}
          </div>

          {/* New Password Input */}
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full p-4 pl-4 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
              aria-label="Enter new password"
              name="password"
              onChange={handleChange}
              value={data.password}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#4a90e2] transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={togglePasswordVisibility}
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
            {errors.password && <span className='error-message fade-in-error'>{errors.password}</span>}
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-8">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="w-full p-4 pl-4 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
              aria-label="Confirm new password"
              name="confirmPassword"
              onChange={handleChange}
              value={data.confirmPassword}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#4a90e2] transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={togglePasswordVisibility}
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
            {errors.confirmPassword && <span className='error-message fade-in-error'>{errors.confirmPassword}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-[#b4e61d] to-[#a4d519] text-[#112240] text-lg font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center ${
              isSubmitting 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:shadow-lg hover:scale-105 active:scale-95"
            }`}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;