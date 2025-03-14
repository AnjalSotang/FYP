import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const ExerciseCard = ({ exercise, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete with loading state
  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(exercise.id || exercise._id);
    console.log(exercise.id)
    setTimeout(() => setIsDeleting(false), 1000);
  };

  // Fix image path handling
  const imageUrl = exercise?.imagePath ? exercise.imagePath.replace(/\\/g, "/") : "";

  return (
    <div className="bg-navy-800 rounded-lg">
       <ToastContainer position="top-center" autoClose={3000} />
       <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-navy-800 p-4 rounded-lg shadow-md">
  <div className="flex flex-col md:flex-row items-center gap-4">
    <div className=" p-1 rounded-lg w-24 h-24 flex items-center justify-center overflow-hidden shadow-sm">
      {imageUrl ? (
        <img
          src={`http://localhost:3001/${imageUrl}`}
          alt={`${exercise.name} illustration`}
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
    
    <div>
      <h2 className="text-white text-lg font-bold mb-1">{exercise.name}</h2>
      <div className="space-y-0.5">
        <p className="text-gray-300 flex items-center">
          <span className="text-lime-300 font-medium text-xs mr-1">Category:</span> 
          <span className="bg-navy-700 px-2 py-0.5 rounded-full text-white text-xs">{exercise.category}</span>
        </p>
        <p className="text-gray-300 flex items-center">
          <span className="text-lime-300 font-medium text-xs mr-1">Primary Muscle:</span> 
          <span className="bg-navy-700 px-2 py-0.5 rounded-full text-white text-xs">{exercise.muscle_group}</span>
        </p>
      </div>
    </div>
  </div>
  
  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
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
        'Delete'
      )}
    </button>
    
    <Link to={`/edit/${exercise.id || exercise._id}`} className="w-full sm:w-auto">
      <button className="bg-lime-400 hover:bg-lime-500 text-navy-900 font-medium py-1.5 px-4 rounded-md transition-colors shadow-sm w-full flex items-center justify-center text-sm">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>
        UPDATE
      </button>
    </Link>
  </div>
</div>
    </div>
  );
};

export default ExerciseCard;