import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Dumbbell,
  FileText,
  ImageIcon,
  Upload,
  Check,
  AlertCircle,
  Target,
  Layers,
  BarChart3,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ExerciseForm = ({ onSubmit, type, initialData, id }) => {
  const Navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [data, setData] = useState({
    name: "",
    muscle_group: "",
    difficulty_level: "",
    instructions: "",
    category: "",
    equipment: "",
    burned_calories: "",
    duration: "",
  });

  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/avif",
    "image/webp",
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  ];
  const MAX_FILE_SIZE = 1024 * 1024 * 50; // 50MB

  const [errors, setErrors] = useState({});

  // Helper function to join classNames conditionally
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  console.log(initialData)

  // If initial data is passed (for update), pre-fill the form
  useEffect(() => {
    if (initialData) {
      setData({
        name: initialData.name || "",
        muscle_group: initialData.muscle_group || "",
        equipment: initialData.equipment || "",
        difficulty_level: initialData.difficulty_level || "",
        instructions: initialData.instructions || "",
        category: initialData.category || "",
        burned_calories: initialData.burned_calories || "",
        duration: initialData.duration || "",
      });

      if (initialData.imagePath) {
        setImage(initialData.imagePath);
        setImagePreview(initialData.imagePath);
      }
    }
  }, [initialData]);

  console.log(data.name)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

const handleFileChange = (e) => {
  const file = e.target.files[0]; // Get the first file
  const fieldName = e.target.name; // Get input name

  if (file) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Unsupported file format" }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, [fieldName]: "File exceeds the 50MB size limit" }));
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: null })); // Reset error
  }
};

  // Remove image function
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };


  const validateForm = () => {
    const newErrors = {};
    if (type === "add") {
      // Validation for exercise name
      if (!data.name) newErrors.name = "Exercise name is required";

      // Validation for muscle group
      if (!data.muscle_group) newErrors.muscle_group = "Primary muscle group is required";

      // Validation for difficulty level
      if (!data.difficulty_level) newErrors.difficulty_level = "Difficulty level is required";

      // Validation for instructions
      if (!data.instructions) newErrors.instructions = "Instructions are required";

      // Validation for equipment
      if (!data.equipment) newErrors.equipment = "At least one equipment is required";

      // Validation for category
      if (!data.category) newErrors.category = "Category is required";

      // Validation for calories and duration
      if (!data.burned_calories) newErrors.burned_calories = "Calories is required";
      if (!data.duration) newErrors.duration = "Duration is required"

      // Validation for image and video
      if (!image) newErrors.image = "Image is required";
    }
    else if (type === "update") {
      // Validation for exercise name
      if (data.name !== undefined && !data.name) newErrors.name = "Exercise name is required";

      // Validation for muscle group
      if (data.muscle_group !== undefined && !data.muscle_group) newErrors.muscle_group = "Primary muscle group is required";

      // Validation for difficulty level
      if (data.difficulty_level !== undefined && !data.difficulty_level) newErrors.difficulty_level = "Difficulty level is required";

      // Validation for instructions
      if (data.instructions !== undefined && !data.instructions) newErrors.instructions = "Instructions are required";

      // Validation for equipment
      if (data.equipment !== undefined && !data.equipment) newErrors.equipment = "At least one equipment is required";

      // Validation for category
      if (data.category !== undefined && !data.category) newErrors.category = "Category is required";

      // Validation for calories and duration
      if (data.burned_calories !== undefined && !data.burned_calories) newErrors.burned_calories = "Calories is required";
      if (data.duration !== undefined && !data.duration) newErrors.duration = "Duration is required"

      // Allow empty image field when updating unless explicitly changed
      if (image !== undefined && !image && !imagePreview) {
        newErrors.image = "Image is required"
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      setIsLoading(false)
      return;
    }

    // Start loading state when the form submission begins
    setIsLoading(true);

    if (type !== "add" && !id) {
      toast.error("Missing exercise ID for update operation");
      Navigate("/exercises");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("id", id); // Add the id if it's for an update
    formData.append("name", data.name);
    formData.append("muscle_group", data.muscle_group);
    formData.append("equipment", data.equipment);
    formData.append("difficulty_level", data.difficulty_level);
    formData.append("instructions", data.instructions);
    formData.append("category", data.category);
    formData.append("burned_calories", data.burned_calories);
    formData.append("duration", data.duration);

    if (image) formData.append("image", image);


    try {
      await onSubmit(formData); // Use the provided onSubmit function



      // Reset form fields after successful submission if adding new exercise
      if (type === "add") {
        setData({
          name: "",
          muscle_group: "",
          equipment: "",
          difficulty_level: "",
          instructions: "",
          category: "",
          burned_calories: "",
          duration: "",
        });
        setImage(null);
        setImagePreview(null);
        setErrors({});
      }

      // Reset loading state after submission is complete
      setIsLoading(false);
    } catch (error) {
      // Handle any submission errors here
      toast.error("Failed to save exercise. Please try again.");
      setIsLoading(false); // Reset loading state in case of an error
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1129] to-[#1a2c50] flex flex-col items-center px-10 py-10 sm:px-6 relative pt-20">
      <div className="w-full max-w-xl mx-auto my-auto">
        <ToastContainer position="top-center" autoClose={3000} />
        <Link to="/admin/excercise" className="w-full sm:w-auto">
          <button className="mb-7 flex items-center gap-2 px-3 py-2 border border-[#A3E635] text-[#A3E635] rounded-md hover:bg-[#A3E635] hover:text-[#111827] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Exercise Manager
          </button>
        </Link>
        {/* Form Container */}
        <div className="bg-gradient-to-b from-[#112240] to-[#0d1a30] py-8 px-6 sm:px-10 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.3)] w-full max-w-xl hover:shadow-[0_15px_60px_rgba(0,0,0,0.4)] transition-all duration-500 border border-[#1e3a6a]/30">
          {/* Heading with subtle animation */}
          <div className="space-y-2 mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {type === "update" ? "Update" : "Add New"} Exercise
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {type === "update" ?
                "Provide details about the exercise to update in your fitness app" : "Provide details about the exercise to track in your fitness app"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Exercise Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-white text-sm font-medium flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-[#a4d519]" />
                Exercise Name <span className="text-[#a4d519]">*</span>
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="e.g., Barbell Squat"
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

            {/* Muscle Groups - 2 column layout on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Primary Muscle Group */}
              <div className="space-y-2">
                <label htmlFor="muscle_group" className="text-white text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#a4d519]" />
                  Primary Muscle <span className="text-[#a4d519]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="muscle_group"
                    type="text"
                    name="muscle_group"
                    placeholder="e.g., Quadriceps"
                    className={classNames(
                      "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50",
                      errors.muscle_group ? "border-red-500 focus:ring-red-500" : "hover:border-[#1e3a6a]",
                    )}
                    onChange={handleChange}
                    value={data.muscle_group}
                    aria-invalid={errors.muscle_group ? "true" : "false"}
                    aria-describedby={errors.muscle_group ? "muscle-error" : undefined}
                  />
                  {errors.muscle_group && (
                    <div id="muscle-error" className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.muscle_group}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Equipment */}
              <div className="space-y-2">
                <label
                  htmlFor="equipment"
                  className="text-white text-sm font-medium flex items-center gap-2"
                >
                  <Layers className="h-4 w-4 text-[#a4d519]" />
                  Equipment <span className="text-[#a4d519]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="equipment"
                    type="text"
                    name="equipment"
                    placeholder="e.g., Dumbbell"
                    className={classNames(
                      "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50",
                      errors.equipment ? "border-red-500 focus:ring-red-500" : "hover:border-[#1e3a6a]",
                    )}
                    onChange={handleChange}
                    value={data.equipment}
                    aria-invalid={errors.equipment ? "true" : "false"}
                    aria-describedby={errors.equipment ? "equipment-error" : undefined}
                  />
                  {errors.equipment && (
                    <div id="equipment-error" className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.equipment}</span>
                    </div>
                  )}
                </div>
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

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-white text-sm font-medium flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#a4d519]" />
                Category <span className="text-[#a4d519]">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  className={classNames(
                    "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50 appearance-none",
                    errors.category ? "border-red-500 focus:ring-red-500" : "hover:border-[#1e3a6a]",
                  )}
                  onChange={handleChange}
                  value={data.category}
                  aria-invalid={errors.category ? "true" : "false"}
                  aria-describedby={errors.category ? "category-error" : undefined}
                >
                  <option value="" className="bg-[#1a2c50]">
                    Select Category
                  </option>
                  <option value="Strength" className="bg-[#1a2c50]">
                    Strength
                  </option>
                  <option value="Bodyweight" className="bg-[#1a2c50]">
                    Bodyweight
                  </option>
                  <option value="Machine" className="bg-[#1a2c50]">
                    Machine
                  </option>
                  <option value="Cardio" className="bg-[#1a2c50]">
                    Cardio
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
                {errors.category && (
                  <div id="category-error" className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Calories and Duration - 2 column layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Burned Calories */}
              <div className="space-y-2">
                <label htmlFor="burned_calories" className="text-white text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#a4d519]" />
                  Calories <span className="text-[#a4d519]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="burned_calories"
                    type="number"
                    name="burned_calories"
                    placeholder="e.g., 150"
                    className={classNames(
                      "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50",
                      errors.burned_calories ? "border-red-500 focus:ring-red-500" : "hover:border-[#1e3a6a]",
                    )}
                    onChange={handleChange}
                    value={data.burned_calories}
                    aria-invalid={errors.burned_calories ? "true" : "false"}
                    aria-describedby={errors.burned_calories ? "calories-error" : undefined}
                  />
                  {errors.burned_calories && (
                    <div
                      id="calories-error"
                      className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn"
                    >
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.burned_calories}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label htmlFor="duration" className="text-white text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#a4d519]" />
                  Duration (min) <span className="text-[#a4d519]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="duration"
                    type="number"
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

            {/* Instructions */}
            <div className="space-y-2">
              <label htmlFor="instructions" className="text-white text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#a4d519]" />
                Instructions <span className="text-[#a4d519]">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="instructions"
                  name="instructions"
                  placeholder="Describe how to perform this exercise correctly..."
                  rows={4}
                  className={classNames(
                    "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50 resize-none",
                    errors.instructions ? "border-red-500 focus:ring-red-500" : "hover:border-[#1e3a6a]",
                  )}
                  onChange={handleChange}
                  value={data.instructions}
                  aria-invalid={errors.instructions ? "true" : "false"}
                  aria-describedby={errors.instructions ? "instructions-error" : undefined}
                />
                {errors.instructions && (
                  <div
                    id="instructions-error"
                    className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn"
                  >
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.instructions}</span>
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
                {/* {errors.image && (
                  <div id="image-error" className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.image}</span>
                  </div>
                )} */}
              </div>
            </div>

            {/* Image preview */}
            {type === 'add' &&imagePreview && (
              <div className="yt-2">
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
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {type === "add" ? "Adding..." : "Updating..."}
                </span>
              ) : (
                type === "add" ? "Add Exercise" : "Update Exercise"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}


export default React.memo(ExerciseForm)

