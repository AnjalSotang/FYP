import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faImage } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const AddExerciseForm = ({ onSubmit }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        muscle_group: "",
        secondary_muscle_group: "",
        difficulty_level: "",
        instructions: "",
        equipment: "",
        category: "",
        burned_calories: "",
        duration: "",
    });

    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle file changes for image/video
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "image") {
            setImage(files[0]);
        } else if (name === "video") {
            setVideo(files[0]);
        }
    };

    // Frontend Validation
    const validateForm = () => {
        let newErrors = {};
        // Validation for exercise name
        if (!data.name) newErrors.name = "Exercise name is required";

        // Validation for muscle group
        if (!data.muscle_group) newErrors.muscle_group = "Primary muscle group is required";

        // Validation for difficulty level
        if (!data.difficulty_level) newErrors.difficulty_level = "Difficulty level is required";

        // Validation for instructions
        if (!data.instructions) newErrors.instructions = "Instructions are required";

        // Validation for equipment
        if (!data.equipment) newErrors.equipment = "Equipment is required";

        // Validation for image and video
        if (!image) newErrors.image = "Image is required";
        if (!video) newErrors.video = "Video is required";

        return newErrors;
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Start loading state when the form submission begins
        setIsLoading(true);

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false); // Reset loading state if validation fails
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("muscle_group", data.muscle_group);
        formData.append("secondary_muscle_group", data.secondary_muscle_group);
        formData.append("difficulty_level", data.difficulty_level);
        formData.append("instructions", data.instructions);
        formData.append("equipment", data.equipment);
        formData.append("category", data.category);
        formData.append("burned_calories", data.burned_calories);
        formData.append("duration", data.duration);
        formData.append("image", image);
        formData.append("video", video);

        // Simulate submitting the form (e.g., API call)
        try {
            await onSubmit(formData); // Proceed with submitting the form if validation passes

            // Reset form fields and loading state after successful submission
            setData({
                name: "",
                muscle_group: "",
                secondary_muscle_group: "",
                difficulty_level: "",
                instructions: "",
                equipment: "",
                category: "",
                burned_calories: "",
                duration: "",
            });
            setImage(null);
            setVideo(null);

            // Reset loading state after submission is complete
            setIsLoading(false);
        } catch (error) {
            // Handle any submission errors here
            setIsLoading(false); // Reset loading state in case of an error
            console.error("Error during form submission:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b1129] to-[#1a2c50] flex flex-col justify-center items-center px-6 relative">
            <div className="w-full max-w-lg sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto">
                {/* Logo */}
                <h1 className="absolute top-8 left-10 text-[#b4e61d] text-4xl font-bold hover:text-[#a4d519] transition">
                    FitTrack
                </h1>

                <ToastContainer position="toast.POSITION.TOP_CENTER" autoClose={3000} />

                {/* Form Container */}
                <div className="bg-[#112240] py-12 px-10 rounded-xl shadow-lg w-full max-w-lg hover:shadow-2xl transition duration-300">
                    {/* Heading */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
                        Add New Exercise
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg text-gray-400 text-center mb-8">
                        Provide details about the new exercise to track it in your fitness app.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Exercise Name */}
                        <div className="relative">
                            <label htmlFor="name" className="text-white">Exercise Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Exercise name"
                                className={`w-full p-4 pl-12 rounded-lg ${errors.name ? 'border-2 border-red-500' : 'border-transparent'} bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition`}
                                onChange={handleChange}
                                value={data.name}
                                autoComplete="off"
                            />
                            {errors.name && <span className="error-message fade-in-error">{errors.name}</span>}
                        </div>

                        {/* Muscle Group */}
                        <div className="relative">
                            <label htmlFor="name" className="text-white">Primary Muscle Group</label>
                            <input
                                type="text"
                                name="muscle_group"
                                placeholder="Primary muscle group"
                                className={`w-full p-4 pl-12 rounded-lg ${errors.name ? 'border-2 border-red-500' : 'border-transparent'} bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition`}
                                onChange={handleChange}
                                value={data.muscle_group}
                            />
                            {errors.muscle_group && <span className="error-message fade-in-error">{errors.muscle_group}</span>}
                        </div>

                        {/* Secondary Muscle Group */}
                        <div className="relative">
                            <label htmlFor="name" className="text-white">Secondary MusclE Group</label>
                            <input
                                type="text"
                                name="secondary_muscle_group"
                                placeholder="Secondary muscle group (optional)"
                                className={`w-full p-4 pl-12 rounded-lg ${errors.name ? 'border-2 border-red-500' : 'border-transparent'} bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition`}
                                onChange={handleChange}
                                value={data.secondary_muscle_group}
                            />
                        </div>

                        {/* Difficulty Level */}
                        <div className="relative">
                            <label htmlFor="name" className="text-white">Diffulty Level</label>
                            <select
                                name="difficulty_level"
                                className={`w-full p-4 pl-12 rounded-lg ${errors.name ? 'border-2 border-red-500' : 'border-transparent'} bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition`}
                                onChange={handleChange}
                                value={data.difficulty_level}
                            >
                                <option value="">Select Difficulty Level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                            {errors.difficulty_level && <span className="error-message fade-in-error">{errors.difficulty_level}</span>}
                        </div>

                        {/* Instructions */}
                        <div className="relative">
                            <textarea
                                name="instructions"
                                placeholder="Instructions"
                                className={`w-full p-4 pl-12 rounded-lg ${errors.name ? 'border-2 border-red-500' : 'border-transparent'} bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition`}
                                onChange={handleChange}
                                value={data.instructions}
                            />
                            {errors.instructions && <span className="error-message fade-in-error">{errors.instructions}</span>}
                        </div>

                        {/* Equipment */}
                        <div className="relative">
                            <input
                                type="text"
                                name="equipment"
                                placeholder="Equipment (comma separated)"
                                className={`w-full p-4 pl-12 rounded-lg ${errors.name ? 'border-2 border-red-500' : 'border-transparent'} bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition`}
                                onChange={handleChange}
                                value={data.equipment}
                            />
                            {errors.equipment && <span className="error-message fade-in-error">{errors.equipment}</span>}
                        </div>

                        {/* Image Upload */}
                        <div className="relative">
                            <input
                                type="file"
                                name="image"
                                className={`w-full p-4 pl-12 rounded-lg ${errors.image ? 'border-2 border-red-500' : 'border-transparent'} bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition`}
                                onChange={handleFileChange}
                            />
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <FontAwesomeIcon
                                    icon={faImage}
                                    className={`${image ? 'text-green-500' : 'text-white'} hover:text-[#a4d519]`}
                                />
                            </span>
                            {errors.image && <span className="error-message fade-in-error">{errors.image}</span>}
                        </div>

                        {/* Video Upload */}
                        <div className="relative">
                            <input
                                type="file"
                                name="video"
                                className={`w-full p-4 pl-12 rounded-lg ${errors.video ? 'border-2 border-red-500' : 'border-transparent'} bg-[#1a2c50] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition`}
                                onChange={handleFileChange}
                            />
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <FontAwesomeIcon
                                    icon={faVideo}
                                    className={`${video ? 'text-green-500' : 'text-white'} hover:text-[#a4d519]`}
                                />
                            </span>
                            {errors.video && <span className="error-message fade-in-error">{errors.video}</span>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full py-3 rounded-lg text-lg font-semibold text-[#112240] bg-gradient-to-r from-[#b4e61d] to-[#a4d519] 
        hover:scale-105 hover:shadow-lg active:scale-95 transition duration-300 
        ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} // Disable and make button less opaque when loading
                            disabled={isLoading} // Disable the button while loading
                        >
                            {isLoading ? 'Submitting...' : 'Add Exercise'} {/* Change text based on loading */}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddExerciseForm;
