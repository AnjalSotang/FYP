import React, { useEffect } from "react";
import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import {
    BarChart3,
    Dumbbell,
    FileText,
    ImageIcon,
    Upload,
    Check,
    AlertCircle,
    Target,
    Loader2,
    ArrowLeft
} from "lucide-react"
import { Link } from "react-router-dom";

const WorkoutForm = ({ id, onSubmit, type, initialData }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);
    const [data, setData] = useState({
        name: "",
        difficulty_level: "",
        description: "",
        goal: "",
        duration: "",
    })

    const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

    const [errors, setErrors] = useState({})

    // Helper function to join classNames conditionally
    const classNames = (...classes) => {
        return classes.filter(Boolean).join(" ")
    }
    console.log(initialData)

    // If initial data is passed (for update), pre-fill the form
    useEffect(() => {
        if (initialData) {
            setData({
                name: initialData.name || "",
                difficulty_level: initialData.difficulty_level || "",
                description: initialData.description || "",
                goal: initialData.goal || "",
                duration: initialData.duration || "",
            });
            // Handle image preview for update
            if (initialData.imagePath) {
                setImagePreview(initialData.imagePath);
            }
        }
    }, [initialData]);

    console.log(data)

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }))
        }
    }

    // Fixed file change handler
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first file

        // Validate the file
        if (file) {
            // Check file type
            if (!file.type.match('image.*|video.*|image/gif')) {
                setErrors((prev) => ({
                    ...prev,
                    image: 'Please upload a valid image or video file'
                }));
                return;
            }

            // Check file size (5MB limit)
            if (file.size > MAX_FILE_SIZE) {
                setErrors((prev) => ({
                    ...prev,
                    image: 'File size must be less than 5MB'
                }));
                return;
            }

            // If validation passes, set the file and clear errors
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setErrors((prev) => ({
                ...prev,
                image: null
            }));
        }
    };


    // Remove image function
    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };



    const validateForm = () => {
        const newErrors = {}
    
        if (type === "add") {
            // For new exercises, all fields are required
            if (!data.name) newErrors.name = "Exercise name is required"
            if (!data.difficulty_level) newErrors.difficulty_level = "Difficulty level is required"
            if (!data.description) newErrors.description = "Description is required"
            if (!image && !imagePreview) newErrors.image = "Image is required"
            if (!data.goal) newErrors.goal = "Goal is required"
            if (!data.duration) newErrors.duration = "Duration is required"
        } else if (type === "update") {
            // Only validate fields that exist (i.e., changed fields)
            if (data.name !== undefined && !data.name) newErrors.name = "Exercise name is required"
            if (data.difficulty_level !== undefined && !data.difficulty_level) newErrors.difficulty_level = "Difficulty level is required"
            if (data.description !== undefined && !data.description) newErrors.description = "Description is required"
            if (data.goal !== undefined && !data.goal) newErrors.goal = "Goal is required"
            if (data.duration !== undefined && !data.duration) newErrors.duration = "Duration is required"
            
            // Allow empty image field when updating unless explicitly changed
            if (image !== undefined && !image && !imagePreview) {
                newErrors.image = "Image is required"
            }
        }
    
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
    
        // Validate form based on operation type
        if (!validateForm()) {
            toast.error("Please fill in all required fields")
            setIsLoading(false)
            return
        }
        // Prepare form data
        const formData = new FormData()
        formData.append("id", id);
        formData.append("name", data.name)
        formData.append("level", data.difficulty_level)
        formData.append("description", data.description)
        formData.append("goal", data.goal)
        formData.append("duration", data.duration)

        if (image) formData.append("image", image)

        console.log("Form data being submitted:", Object.fromEntries(formData.entries()));
        try {
            console.log("Form data being submitted:", Object.fromEntries(formData.entries()));
            onSubmit(formData);
            // toast.success("Workout added successfully!");

            // Reset form fields after successful submission
            // Reset form only for new workouts, not updates
            if (type === "add") {
                setData({
                    name: "",
                    level: "",
                    description: "",
                    goal: "",
                    duration: "",
                });
                setImage(null);
                setImagePreview(null);
                setErrors({});
            } // Clear any errors

            // Reset loading state after submission is complete
            setIsLoading(false)
        } catch (error) {
            // Handle any submission errors here
            toast.error("Failed to add exercise. Please try again.")
            setIsLoading(false) // Reset loading state in case of an error
            console.error("Error during form submission:", error)
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b1129] to-[#1a2c50] flex flex-col items-center px-10 py-10 sm:px-6 relative pt-10" >
            <div className="w-full max-w-xl mx-auto my-auto">
                <ToastContainer position="top-center" autoClose={3000} />

                <Link to="/Workout" className="w-full sm:w-auto">
                    <button

                        className="mb-7 flex items-center gap-2 px-3 py-2 border border-[#A3E635] text-[#A3E635] rounded-md hover:bg-[#A3E635] hover:text-[#111827] transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Workouts
                    </button>
                </Link>

                {/* Form Container */}
                <div className="bg-gradient-to-b from-[#112240] to-[#0d1a30] py-8 px-6 sm:px-10 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.3)] w-full max-w-xl hover:shadow-[0_15px_60px_rgba(0,0,0,0.4)] transition-all duration-500 border border-[#1e3a6a]/30">
                    {/* Heading with subtle animation */}
                    <div className="space-y-2 mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            {type === "add" ? "Add New" : "Update"} Workout
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Provide details about the new workout to track in your fitness app
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">


                        {/* Workout Name */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-white text-sm font-medium flex items-center gap-2">
                                <Dumbbell className="h-4 w-4 text-[#a4d519]" />
                                Workout Name <span className="text-[#a4d519]">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="e.g., Full Body Workout"
                                    className={classNames(
                                        "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50",
                                        errors.name ? "border-red-500 focus:ring-red-500" : "hover:border-[#1e3a6a]",
                                    )}
                                    onChange={handleChange}
                                    value={data.name}
                                    autoComplete="off"
                                    aria-invalid={errors.name ? "true" : "false"}
                                    aria-describedby={errors.name ? "name-error" : undefined}
                                />
                                {errors.name && (
                                    <div id="name-error" className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Difficulty Level */}
                        <div className="space-y-2">
                            <label htmlFor="difficulty_level" className="text-white text-sm font-medium flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-[#a4d519]" />
                                Difficulty Level <span className="text-[#a4d519]">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="difficulty_level"
                                    name="difficulty_level"
                                    className={classNames(
                                        "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50 appearance-none",
                                        errors.difficulty_level ? "border-red-500 focus:ring-red-500" : "hover:border-[#1e3a6a]",
                                    )}
                                    onChange={handleChange}
                                    value={data.difficulty_level}
                                    aria-invalid={errors.difficulty_level ? "true" : "false"}
                                    aria-describedby={errors.difficulty_level ? "difficulty-error" : undefined}
                                >
                                    <option value="" className="bg-[#1a2c50]">
                                        Select Difficulty Level
                                    </option>
                                    <option value="Beginner" className="bg-[#1a2c50]">
                                        Beginner
                                    </option>
                                    <option value="Intermediate" className="bg-[#1a2c50]">
                                        Intermediate
                                    </option>
                                    <option value="Advanced" className="bg-[#1a2c50]">
                                        Advanced
                                    </option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                                {errors.difficulty_level && (
                                    <div
                                        id="difficulty-error"
                                        className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn"
                                    >
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.difficulty_level}</span>
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Goal and Duration - 2 column layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Goal */}
                            <div className="space-y-2">
                                <label htmlFor="goal" className="text-white text-sm font-medium flex items-center gap-2">
                                    <Target className="h-4 w-4 text-[#a4d519]" />
                                    Goal <span className="text-[#a4d519]">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="goal"
                                        type="text"
                                        name="goal"
                                        placeholder="e.g., Muscle Building"
                                        className={classNames(
                                            "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50",
                                            errors.goal ? "border-red-500 focus:ring-red-500" : "hover:border-[#1e3a6a]",
                                        )}
                                        onChange={handleChange}
                                        value={data.goal}
                                        aria-invalid={errors.goal ? "true" : "false"}
                                        aria-describedby={errors.goal ? "calories-error" : undefined}
                                    />
                                    {errors.goal && (
                                        <div
                                            id="goal-error"
                                            className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn"
                                        >
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.goal}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <label htmlFor="duration" className="text-white text-sm font-medium flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-[#a4d519]" />
                                    Duration (days) <span className="text-[#a4d519]">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="duration"
                                        type="text"
                                        name="duration"
                                        placeholder="e.g., 30"
                                        className={classNames(
                                            "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50",
                                            errors.duration ? "border-red-500 focus:ring-red-500" : "hover:border-[#1e3a6a]",
                                        )}
                                        onChange={handleChange}
                                        value={data.duration}
                                        aria-invalid={errors.duration ? "true" : "false"}
                                        aria-describedby={errors.duration ? "duration-error" : undefined}
                                    />
                                    {errors.duration && (
                                        <div
                                            id="duration-error"
                                            className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn"
                                        >
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.duration}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="text-white text-sm font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4 text-[#a4d519]" />
                                description <span className="text-[#a4d519]">*</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe how to perform this exercise correctly..."
                                    rows={4}
                                    className={classNames(
                                        "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50 resize-none",
                                        errors.description ? "border-red-500 focus:ring-red-500" : "hover:border-[#1e3a6a]",
                                    )}
                                    onChange={handleChange}
                                    value={data.description}
                                    aria-invalid={errors.description ? "true" : "false"}
                                    aria-describedby={errors.description ? "instructions-error" : undefined}
                                />
                                {errors.description && (
                                    <div
                                        id="description-error"
                                        className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn"
                                    >
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.description}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label htmlFor="image" className="text-white text-sm font-medium flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-[#a4d519]" />
                                Exercise Image <span className="text-[#a4d519]">*</span>
                            </label>
                            <div className="relative">
                                <div
                                    className={classNames(
                                        "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white border border-dashed border-[#1e3a6a]/70 hover:border-[#4a90e2] transition-all duration-200 flex flex-col items-center justify-center cursor-pointer",
                                        image ? "border-[#a4d519]" : "",
                                        errors.image ? "border-red-500" : "",
                                    )}
                                >
                                    <input
                                        id="image"
                                        type="file"
                                        name="image"
                                        accept="image/*,video/*,image/gif" // Accepts images, videos, and GIFs
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        aria-invalid={errors.image ? "true" : "false"}
                                        aria-describedby={errors.image ? "image-error" : undefined}
                                    />
                                    <div className="flex flex-col items-center py-2 text-center">
                                        {image ? (
                                            <>
                                                <Check className="h-5 w-5 text-[#a4d519] mb-1" />
                                                <span className="text-xs text-gray-300 truncate max-w-full">{image.name}</span>
                                            </>
                                        ) : imagePreview ? (
                                            <>
                                                <Check className="h-5 w-5 text-[#a4d519] mb-1" />
                                                <span className="text-xs text-gray-300">Current image selected</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-5 w-5 text-gray-400 mb-1" />
                                                <span className="text-xs text-gray-400">Upload image</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {errors.image && (
                                    <div id="image-error" className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{errors.image}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image preview */}
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={image ? URL.createObjectURL(image) : imagePreview}
                                    alt="Preview"
                                    className="max-h-32 rounded-lg object-contain"
                                />
                                <button
                                    type="button" // Make sure this doesn't submit the form
                                    onClick={removeImage}
                                    className="text-xs text-red-400 hover:text-red-300 mt-1"
                                >
                                    Remove image
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={classNames(
                                "w-full py-3.5 rounded-lg text-lg font-semibold text-[#112240] mt-6",
                                "bg-gradient-to-r from-[#b4e61d] to-[#a4d519]",
                                "hover:shadow-[0_0_20px_rgba(164,213,25,0.4)] hover:scale-[1.02]",
                                "active:scale-[0.98] transition-all duration-300",
                                isLoading ? "opacity-70 cursor-not-allowed" : "",
                            )}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    {type === "add" ? "Adding..." : "Updating..."}
                                </span>
                            ) : (
                                type === "add" ? "Add Workout" : "Update Workout"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default React.memo(WorkoutForm)

