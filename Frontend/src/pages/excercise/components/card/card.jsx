import React, { useState } from 'react';
import { Trash2, ToggleLeft, ToggleRight, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
// import image from "../../../../../../Backend/uploads/1741855058456hER HAI.png";
// import anotherImage from "FYP/Backend/uploads/1741855058456hER HAI.png"

const Card = ({ exercise, onDelete, onToggleActive }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(exercise.id);
    setTimeout(() => setIsDeleting(false), 1000);
  };

  const handleToggleActive = () => {
    onToggleActive(exercise.id, exercise.isActive);
  };

  //image pathname changed
  const imageUrl = exercise.imagePath.replace(/\\/g, "/");

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* <img src={image}>
      </img> */}
      {/* Card Image */}
      <div className="h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
        {exercise.imagePath ? (
          <img 
            src={`http://localhost:3001/${imageUrl}`} 
            alt={exercise.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-800">
            <span className="text-gray-500 dark:text-gray-400">No Image</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
          exercise.isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {exercise.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
          {exercise.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {exercise.description?.substring(0, 100)}
          {exercise.description?.length > 100 ? '...' : ''}
        </p>

        {/* Exercise Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="text-gray-500 dark:text-gray-400">Category:</div>
          <div className="text-gray-700 dark:text-gray-200">{exercise.category || 'N/A'}</div>
          
          <div className="text-gray-500 dark:text-gray-400">Difficulty:</div>
          <div className="text-gray-700 dark:text-gray-200">{exercise.difficulty_level || 'N/A'}</div>
          
          {/* <div className="text-gray-500 dark:text-gray-400">Equipment:</div>
          <div className="text-gray-700 dark:text-gray-200">{exercise.equipment || 'None'}</div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <Link 
            to={`/exercises/edit/${exercise.id}`}
            className="p-2 rounded-md bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
          >
            <Edit size={18} />
          </Link>
          
          <button
            onClick={handleToggleActive}
            className={`p-2 rounded-md ${
              exercise.isActive 
                ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800' 
                : 'bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800'
            } transition-colors`}
            aria-label={exercise.isActive ? 'Deactivate exercise' : 'Activate exercise'}
          >
            {exercise.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-md bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
            aria-label="Delete exercise"
          >
            <Trash2 size={18} className={isDeleting ? 'animate-pulse' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;