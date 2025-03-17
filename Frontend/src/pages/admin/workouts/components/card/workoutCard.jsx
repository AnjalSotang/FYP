import React, { useState } from 'react';
import { Link, Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Trash2, Edit } from "lucide-react"

const workoutCard = ({ workout, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete with loading state
  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(workout.id || workout._id);
    console.log(workout.id)
    setTimeout(() => setIsDeleting(false), 1000);
  };

  
  // const handleCardClick = (id) => {
  //   Router.push(`/workout/${id}`)
  // }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  const getDifficultyClass = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-900 text-green-300"
      case "intermediate":
        return "bg-yellow-900 text-yellow-300"
      case "advance":
        return "bg-red-900 text-red-300"
      default:
        return "bg-gray-800 text-gray-300"
    }
  }



  // Fix image path handling
  const imageUrl = workout?.imagePath ? workout.imagePath.replace(/\\/g, "/") : "";

  return (
    <div
      key={workout.id}
      className="border border-[#273549] rounded-lg bg-[#273549] overflow-hidden cursor-pointer hover:border-[#A3E635] transition-colors"
      // onClick={() => handleCardClick(workout.id)}
    >
           <ToastContainer position="top-center" autoClose={3000} />
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Section */}
          <div className="relative h-48 md:h-auto md:w-1/4 rounded-md overflow-hidden z-0">
          {imageUrl ? (
              <img
                src={`http://localhost:3001/${imageUrl}`}
                alt={`${workout.name} illustration`}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="text-gray-400 text-xs font-medium flex items-center justify-center h-full">
                <svg className="w-4 h-4 mr-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                No image
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold text-white">{workout.name}</h2>
              <div className="flex space-x-2">
                <Link to={`/UpdateWorkout/${workout.id || workout._id}`} className="w-full sm:w-auto">
                  <button
                    className="px-3 py-1 border border-[#A3E635] text-[#A3E635] rounded-md flex items-center gap-1 hover:bg-[#A3E635] hover:text-[#111827] transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Update
                  </button>
                </Link>

                <button
                  className={`${isDeleting ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'} text-white font-medium py-1.5 px-4 rounded-md transition-colors shadow-sm flex items-center justify-center text-sm`}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                    </>
                    
                  )}
                </button>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{workout.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyClass(workout.difficulty_level)}`}
              >
                {workout.difficulty_level}
              </span>
              <span className="px-2 py-1 bg-[#111827] text-gray-300 rounded-full text-xs font-medium">
                {workout.duration}
              </span>
              <span className="px-2 py-1 bg-[#111827] text-gray-300 rounded-full text-xs font-medium">
                {workout.goal}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${workout.is_active ? "bg-[#A3E635] text-[#111827]" : "bg-red-900 text-red-300"}`}
              >
                {workout.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-auto">
              
              <div>
                <p className="font-semibold text-gray-200">Created:</p>
                <p className="text-gray-400">{formatDate(workout.createdAt)}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-200">Updated:</p>
                <p className="text-gray-400">{formatDate(workout.updatedAt)}</p>
              </div>
              {/* <div>
                <p className="font-semibold text-gray-200">Exercises:</p>
                <p className="text-gray-400">{workout.exercises.length} exercises</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default workoutCard;