import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProfileForm = ({ type, onNext }) => {
    const [data, setData] = useState({
        userName: "",
        gender: "",
        age: "",
        weight: "",
        heightFeet: "",
        heightInches: ""
    });

    const [errors, setErrors] = useState({})

    // Update form data as user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const validateForm = () => {
        let newErrors = {};

        // Name validation
        if (type === "userName") {
            if (!data.userName.trim()) {
                newErrors.userName = "Name is required";
            } else if (!/^[a-zA-Z\s]+$/.test(data.userName)) {
                newErrors.userName = "Name can only contain letters and spaces";
            }
        }

        // Health validation
        if (type === "Health") {
            // Gender validation
            if (!data.gender) {
                newErrors.gender = "Gender is required";
            }

            // Weight validation
            if (!data.weight.trim()) {
                newErrors.weight = "Weight is required";
            } else if (isNaN(data.weight) || parseFloat(data.weight) <= 0) {
                newErrors.weight = "Weight must be a positive number";
            }

            // Age validation
            if (!data.age.trim()) {
                newErrors.age = "Age is required";
            } else if (isNaN(data.age) || parseInt(data.age) < 18 || parseInt(data.age) > 100) {
                newErrors.age = "Age must be between 18 and 100";
            }

            // Height validation
            if (!data.heightFeet.trim()) {
                newErrors.heightFeet = "Height (feet) is required";
            } else if (isNaN(data.heightFeet) || parseInt(data.heightFeet) <= 0) {
                newErrors.heightFeet = "Height (feet) must be a positive number";
            }

            if (!data.heightInches.trim()) {
                newErrors.heightInches = "Height (inches) is required";
            } else if (isNaN(data.heightInches) || parseInt(data.heightInches) < 0 || parseInt(data.heightInches) > 12) {
                newErrors.heightInches = "Height (inches) must be between 0 and 12";
            }
        }

        return newErrors;
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onNext(data)
        console.log(data.userName)
    };

    const subHeadings = {
        userName: "Let's set up your profile",
        Health: "We use gender, weight, and age to provide you with the most accurate personalized workouts",
        setup: "Set Up Your Profile",
        forgot: "Reset Your Password",
    };

    const Headings = {
        userName: "What should we call you?",
        Health: "Enter your health details!",
        setup: "Set Up Your Profile",
        forgot: "Reset Your Password",
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b1129] to-[#1a2c50] flex flex-col justify-center items-center px-6 relative">
            {/* Logo */}
            <h1 className="absolute top-10 left-12 text-[#b4e61d] text-4xl font-bold tracking-wide">
                FitTrack
            </h1>

            {/* Form Container */}
            <div className="bg-[#112240] py-12 px-10 rounded-2xl shadow-lg shadow-black/40 w-full max-w-lg hover:shadow-xl transition duration-300">
                {/* Heading */}
                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    {Headings[type] || "Welcome to FitTrack"}
                </h1>

                {/* Subheading */}
                <p className="text-lg text-gray-400 text-center mb-9">
                    {subHeadings[type] || "Welcome to FitTrack"}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {type === "userName" && (
                        <div className="mb-6">
                            {/* Name Input */}
                            <input
                                type="text"
                                name="userName"
                                placeholder="Enter your name"
                                className="w-full p-4 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
                                onChange={handleChange}
                                autoComplete="off"
                            />
                            {errors.userName && <span className="error-message">{errors.userName}</span>}
                        </div>

                    )}

                    {type === "Health" && (
                        <>
                            {/* Gender Radio Buttons */}
                            <div className="mb-4">

                                <select
                                    name="gender"
                                    onChange={handleChange}
                                    value={data.gender}
                                    className="w-full p-3 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition duration-200"

                                // className="w-full p-4 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition duration-200"
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <span className="error-message">{errors.gender}</span>}
                            </div>


                            {/* Weight Input */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    name="weight"
                                    placeholder="Enter your weight (kg)"
                                    className="w-full p-4 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                                {errors.weight && <span className="error-message">{errors.weight}</span>}
                            </div>

                            {/* Age Input */}
                            <div className="mb-6">
                                {/* Input Wrapper */}
                                <div className="relative">
                                    {/* Input Field */}
                                    <input
                                        type="input"
                                        name="age"
                                        placeholder="Enter your age"
                                        className="w-full p-4 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />

                                </div>
                                {errors.age && <span className="error-message">{errors.age}</span>}
                            </div>


                            {/* Height Inputs */}
                            <div className="flex space-x-4">
                                {/* Height in Feet */}
                                <input
                                    type="number"
                                    name="heightFeet"
                                    placeholder="Height (feet)"
                                    className="flex-1 p-3 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition text-sm"
                                    onChange={handleChange}
                                    autoComplete="off"
                                />


                                {/* Height in Inches */}
                                <input
                                    type="number"
                                    name="heightInches"
                                    placeholder="Height (inches)"
                                    className="flex-1 p-3 rounded-lg bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition text-sm"
                                    onChange={handleChange}
                                    autoComplete="off"
                                />


                            </div>
                            <div className="flex space-x-12">
                                {errors.heightFeet && <span className="error-message">{errors.heightFeet}</span>}
                                {errors.heightInches && <span className="error-message">{errors.heightInches}</span>}
                            </div>
                        </>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-between items-center mt-15 space-x-6">
                        {/* Back Button */}
                        <Link
                            to={type === "Health" ? "/Motivation" : "/Register"}
                            className="flex-1 bg-gray-300 text-gray-800 text-lg font-semibold py-3 rounded-lg hover:bg-gray-400 hover:shadow-md transition duration-300 text-center"
                        >
                            Back
                        </Link>

                        {/* Next/Save Button */}
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-[#b4e61d] to-[#a4d519] text-[#112240] text-lg font-semibold py-3 rounded-lg hover:shadow-md hover:scale-105 active:scale-95 transition duration-300"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default ProfileForm;
