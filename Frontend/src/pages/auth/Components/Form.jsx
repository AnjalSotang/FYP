import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Form = ({ type, onSubmit }) => {
    const [data, setData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Toggle Password Visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Optimize event handler with useCallback
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Frontend Validation
    const validateForm = () => {
        let newErrors = {};

        // Email validation
        if (!data.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = "Invalid email format";
        }

        // Password validation
        if (!data.password) {
            newErrors.password = "Password is required";
        } else if (data.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        // Confirm Password validation for register type
        if (type === "register") {
            if (!data.confirmPassword) {
                newErrors.confirmPassword = "Confirm password is required";
            } else if (data.password !== data.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        return newErrors;
    };

   // Handle Submit
   const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }
    onSubmit(data); // Proceed with submitting the form if validation passes
};
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b1129] to-[#1a2c50] flex flex-col justify-center items-center px-6 relative">
            {/* Logo */}
            <h1 className="absolute top-8 left-10 text-[#b4e61d] text-4xl font-bold hover:text-[#a4d519] transition">
                FitTrack
            </h1>

            <ToastContainer position="top-right" autoClose={3000} />

            {/* Form Container */}
            <div className="bg-[#112240] py-12 px-10 rounded-xl shadow-lg w-full max-w-lg hover:shadow-2xl transition duration-300">
                {/* Heading */}
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
                    {type === "register" ? "Create Your FitTrack Account" : "Welcome Back to FitTrack!"}
                </h1>

                {/* Subheading */}
                <p className="text-lg text-gray-400 text-center mb-8">
                    {type === "register"
                        ? "Join us today and start your fitness journey with personalized tools and insights."
                        : "Log in to track your fitness progress and achieve your goals."}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-full p-4 pl-12 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
                            onChange={handleChange}
                            autoComplete="new email"
                            aria-label="Enter your email"
                            autoFocus
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                        {errors.email && <span className='error-message fade-in-error'>{errors.email}</span>}
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder={type === "register" ? "Create a password" : "Enter your password"}
                            className="w-full p-4 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
                            onChange={handleChange}
                            autoComplete="off"
                            aria-label={type === "register" ? "Create a password" : "Enter your password"}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#4a90e2] transition"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                           

                        </button>
                        {errors.password && <span className='error-message fade-in-error'>{errors.password}</span>}
                    </div>

                    {/* Confirm Password Input */}
                    {type === "register" && (
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                className="w-full p-4 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
                                onChange={handleChange}
                                autoComplete="off"
                                aria-label="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#4a90e2] transition"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                            {errors.confirmPassword && <span className='error-message fade-in-error'>{errors.confirmPassword}</span>}

                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        // disabled={isLoading}
                        className="w-full py-3 rounded-lg text-lg font-semibold text-[#112240] bg-gradient-to-r from-[#b4e61d] to-[#a4d519] hover:scale-105 hover:shadow-lg active:scale-95 transition duration-300 ${isLoading"
                    >
                        {type === "register" ? "Sign Up" : "Sign In"}
                    </button>
                </form>


                {/* Footer */}
                <div className="mt-10 text-center">
                    {type === "register" ? (
                        <p className="text-gray-300 text-base">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-[#4a90e2] font-semibold hover:underline hover:text-[#3b7ac9] active:text-[#2a78b7] transition"
                            >
                                Sign in to your account!
                            </Link>
                        </p>
                    ) : (
                        <>
                            <p className="text-gray-300 text-base">
                                Not a member yet?{" "}
                                <Link
                                    to="/register"
                                    className="text-[#4a90e2] font-semibold hover:underline hover:text-[#3b7ac9] active:text-[#2a78b7] transition"
                                >
                                    Sign up now!
                                </Link>
                            </p>
                            <Link
                                to="/forgot"
                                className="text-[#4a90e2] font-semibold hover:underline hover:text-[#3b7ac9] active:text-[#2a78b7] block mt-4 transition"
                            >
                                Forgot Password?
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>

    );
};

export default React.memo(Form);
