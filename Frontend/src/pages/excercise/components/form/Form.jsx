import React from "react";
import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import {
  Dumbbell,
  FileText,
  ImageIcon,
  Video,
  Upload,
  Check,
  AlertCircle,
  Target,
  Layers,
  BarChart3,
  Loader2,
} from "lucide-react"

const AddExerciseForm = ({ onSubmit, type }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [video, setVideo] = useState(null)
  const [data, setData] = useState({
    name: "",
    muscle_group: "",
    secondary_muscle_group: "",
    difficulty_level: "",
    instructions: "",
    category: "",
    burned_calories: "",
    duration: "",
  })
  const [equipmentFiles, setEquipmentFiles] = useState([])

  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]
  const MAX_FILE_SIZE = 1024 * 1024 * 50 // 5MB

  const [errors, setErrors] = useState({})

  // Helper function to join classNames conditionally
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target

    if (files && files.length > 0) {
      if (name === "image") {
        setImage(files[0])
        if (errors.image) setErrors((prev) => ({ ...prev, image: null }))
      } else if (name === "video") {
        setVideo(files[0])
        if (errors.video) setErrors((prev) => ({ ...prev, video: null }))
      } else if (name === "equipment") {
        // Validate equipment files
        const filesArray = Array.from(files)
        const fileErrors = []

        const validFiles = filesArray.filter((file) => {
          // Check file type
          if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            fileErrors.push(`"${file.name}" has an unsupported file type`)
            return false
          }

          // Check file size
          if (file.size > MAX_FILE_SIZE) {
            fileErrors.push(`"${file.name}" exceeds the 5MB size limit`)
            return false
          }

          return true
        })

        setEquipmentFiles(validFiles)

        if (fileErrors.length > 0) {
          setErrors((prev) => ({
            ...prev,
            equipment: fileErrors.join(". "),
          }))
        } else if (errors.equipment) {
          setErrors((prev) => ({ ...prev, equipment: null }))
        }
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    // Validation for exercise name
    if (!data.name) newErrors.name = "Exercise name is required"

    // Validation for muscle group
    if (!data.muscle_group) newErrors.muscle_group = "Primary muscle group is required"

    // Validation for difficulty level
    if (!data.difficulty_level) newErrors.difficulty_level = "Difficulty level is required"

    // Validation for instructions
    if (!data.instructions) newErrors.instructions = "Instructions are required"

    // Validation for equipment files
    if (equipmentFiles.length === 0) newErrors.equipment = "At least one equipment file is required"

    // Validation for image and video
    if (!image) newErrors.image = "Image is required"
    if (!video) newErrors.video = "Video is required"

    if (!data.category) newErrors.category = "Category is required"

    if (!data.burned_calories) newErrors.burned_calories = "Calories is required"

    if (!data.duration) newErrors.duration = "Duration is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Start loading state when the form submission begins
    setIsLoading(true)

    if (type !== "update" && !validateForm()) {
      toast.error("Please fill in all required fields")
      setIsLoading(false) // Reset loading state if validation fails
      return
    }

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("muscle_group", data.muscle_group)
    formData.append("secondary_muscle_group", data.secondary_muscle_group)
    formData.append("difficulty_level", data.difficulty_level)
    formData.append("instructions", data.instructions)
    formData.append("category", data.category)
    formData.append("burned_calories", data.burned_calories)
    formData.append("duration", data.duration)

    if (image) formData.append("image", image)
    if (video) formData.append("video", video)

    // Append all equipment files to the same key
    equipmentFiles.forEach(file => {
      formData.append("equipment", file);
    });

    console.log(formData)
    try {
      console.log(formData)
      await onSubmit(formData) // Use the provided onSubmit function

      // Reset form fields after successful submission
      setData({
        name: "",
        muscle_group: "",
        secondary_muscle_group: "",
        difficulty_level: "",
        instructions: "",
        category: "",
        burned_calories: "",
        duration: "",
      })
      setImage(null)
      setVideo(null)
      setEquipmentFiles([])

      // Reset loading state after submission is complete
      setIsLoading(false)
    } catch (error) {
      // Handle any submission errors here
      toast.error("Failed to add exercise. Please try again.")
      setIsLoading(false) // Reset loading state in case of an error
      console.error("Error during form submission:", error)
    }
  }

  const removeEquipmentFile = (index) => {
    setEquipmentFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1129] to-[#1a2c50] flex flex-col items-center px-10 py-10 sm:px-6 relative pt-20" >
  <div className="w-full max-w-xl mx-auto my-auto">
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Form Container */}
        <div className="bg-gradient-to-b from-[#112240] to-[#0d1a30] py-8 px-6 sm:px-10 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.3)] w-full max-w-xl hover:shadow-[0_15px_60px_rgba(0,0,0,0.4)] transition-all duration-500 border border-[#1e3a6a]/30">
          {/* Heading with subtle animation */}
          <div className="space-y-2 mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {type === "update" ? "Update" : "Add New"} Exercise
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Provide details about the new exercise to track in your fitness app
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

              {/* Secondary Muscle Group */}
              <div className="space-y-2">
                <label
                  htmlFor="secondary_muscle_group"
                  className="text-white text-sm font-medium flex items-center gap-2"
                >
                  <Layers className="h-4 w-4 text-[#a4d519]" />
                  Secondary Muscle
                </label>
                <input
                  id="secondary_muscle_group"
                  type="text"
                  name="secondary_muscle_group"
                  placeholder="e.g., Hamstrings (optional)"
                  className="w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition-all duration-200 border border-[#1e3a6a]/50 hover:border-[#1e3a6a]"
                  onChange={handleChange}
                  value={data.secondary_muscle_group}
                />
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
                  <option value="Cardio" className="bg-[#1a2c50]">
                    Cardio
                  </option>
                  <option value="Flexibility" className="bg-[#1a2c50]">
                    Flexibility
                  </option>
                  <option value="Balance" className="bg-[#1a2c50]">
                    Balance
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

            {/* Equipment */}
            <div className="space-y-2">
              <label htmlFor="equipment" className="text-white text-sm font-medium flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-[#a4d519]" />
                Equipment Files <span className="text-[#a4d519]">*</span>
              </label>
              <div className="relative">
                <div
                  className={classNames(
                    "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white border border-dashed border-[#1e3a6a]/70 hover:border-[#4a90e2] transition-all duration-200 flex flex-col items-center justify-center cursor-pointer",
                    equipmentFiles.length > 0 ? "border-[#a4d519]" : "",
                    errors.equipment ? "border-red-500" : "",
                  )}
                >
                  <input
                    id="equipment"
                    type="file"
                    name="equipment"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                    aria-invalid={errors.equipment ? "true" : "false"}
                    aria-describedby={errors.equipment ? "equipment-error" : undefined}
                  />
                  <div className="flex flex-col items-center py-2 text-center">
                    <Upload className="h-5 w-5 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-300">Upload equipment files</span>
                    <span className="text-xs text-gray-400 mt-1">Select multiple files (Images, PDFs, Documents)</span>
                    <span className="text-xs text-gray-500 mt-1">Max 5MB per file</span>
                  </div>
                </div>
                {errors.equipment && (
                  <div
                    id="equipment-error"
                    className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn"
                  >
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.equipment}</span>
                  </div>
                )}
              </div>
              {/* Equipment Files Preview */}
              {equipmentFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-400">Selected files ({equipmentFiles.length}):</p>
                  <div className="max-h-[150px] overflow-y-auto pr-2 space-y-2">
                    {equipmentFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#1a2c50]/60 rounded-lg p-2 text-sm"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {file.type.startsWith("image/") ? (
                            <ImageIcon className="h-4 w-4 text-blue-400 flex-shrink-0" />
                          ) : file.type.includes("pdf") ? (
                            <FileText className="h-4 w-4 text-red-400 flex-shrink-0" />
                          ) : (
                            <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span className="text-xs text-gray-300 truncate">
                            {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEquipmentFile(index)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          aria-label={`Remove ${file.name}`}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Media Uploads - 2 column layout on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

              {/* Video Upload */}
              <div className="space-y-2">
                <label htmlFor="video" className="text-white text-sm font-medium flex items-center gap-2">
                  <Video className="h-4 w-4 text-[#a4d519]" />
                  Exercise Video <span className="text-[#a4d519]">*</span>
                </label>
                <div className="relative">
                  <div
                    className={classNames(
                      "w-full p-3 rounded-lg bg-[#1a2c50]/80 text-white border border-dashed border-[#1e3a6a]/70 hover:border-[#4a90e2] transition-all duration-200 flex flex-col items-center justify-center cursor-pointer",
                      video ? "border-[#a4d519]" : "",
                      errors.video ? "border-red-500" : "",
                    )}
                  >
                    <input
                      id="video"
                      type="file"
                      name="video"
                      accept="image/*,video/*,image/gif" // Accepts images, videos, and GIFs
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      aria-invalid={errors.video ? "true" : "false"}
                      aria-describedby={errors.video ? "video-error" : undefined}
                    />
                    <div className="flex flex-col items-center py-2 text-center">
                      {video ? (
                        <>
                          <Check className="h-5 w-5 text-[#a4d519] mb-1" />
                          <span className="text-xs text-gray-300 truncate max-w-full">{video.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-400">Upload video</span>
                        </>
                      )}
                    </div>
                  </div>
                  {errors.video && (
                    <div id="video-error" className="flex items-center gap-1 mt-1 text-red-400 text-xs animate-fadeIn">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.video}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
                  Submitting...
                </span>
              ) : (
                "Add Exercise"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AddExerciseForm)

