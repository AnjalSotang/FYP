import React, { useRef, useState } from 'react';
import { AlignLeft, MoreHorizontal, Edit, Trash2, ArrowRightCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Card = ({ workouts, onDelete }) => {
  const [showActionsForId, setShowActionsForId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const containerRef = useRef(null);
  const actionMenuRefs = useRef({});
  console.log(workouts)
  // Close action menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActionsForId && actionMenuRefs.current[showActionsForId] &&
        !actionMenuRefs.current[showActionsForId].contains(event.target)) {
        setShowActionsForId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActionsForId]);

  const getDifficultyClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-navy-800 rounded-xl overflow-hidden shadow-lg" ref={containerRef}>
      <div className="p-6 md:p-8 lg:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 flex items-center">
          <span className="bg-lime-300/20 text-lime-300 p-2 rounded mr-3">
            <AlignLeft className="w-5 h-5" />
          </span>
          All Workout Plans
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-navy-600 rounded-lg">
            <thead>
              <tr className="text-left bg-navy-900">
                <th className="py-4 pl-6 pr-6 text-gray-300 font-semibold text-lg border-b border-navy-600">Workout Plan</th>
                <th className="py-4 px-6 text-gray-300 font-semibold text-lg border-b border-navy-600">Difficulty Level</th>
                <th className="py-4 px-6 text-gray-300 font-semibold text-lg border-b border-navy-600">Duration</th>
                <th className="py-4 px-6 text-gray-300 font-semibold text-lg border-b border-navy-600">Goal</th>
                <th className="py-4 px-6 text-gray-300 font-semibold text-lg border-b border-navy-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
      
              {workouts.data.map((data, index) => {
              
                const imageUrl = data?.imagePath ? data.imagePath.replace(/\\/g, "/") : "";
                const id = data.id || data._id;

                return (
                  <tr
                    key={id}
                    className="border-b border-navy-600 hover:bg-navy-700 transition-all duration-200"
                  >
                    <td className="py-5 pl-6 pr-6">
                      <div className="flex items-center space-x-4">
                        {imageUrl ? (
                          <img
                            src={`http://localhost:3001/${imageUrl}`}
                            alt={data?.name}
                            className="h-16 w-20 rounded object-cover"
                          />
                        ) : (
                          <div className="h-16 w-20 bg-navy-700 rounded flex items-center justify-center text-gray-500">
                            No img
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-lg text-white truncate">
                            {data?.name || "Unnamed Exercise"}
                          </p>
                          <p className="text-sm text-gray-400 truncate max-w-xs">
                            {data?.descriptions
                              ? data.descriptions.substring(0, 50) + (data.descriptions.length > 50 ? "..." : "")
                              : "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-5 px-6">
                      <span className={`px-4 py-2 rounded text-sm font-medium ${getDifficultyClass(data?.level)}`}>
                        {data?.level || "Unknown"}
                      </span>
                    </td>

                    <td className="py-5 px-6 text-lg text-gray-300">
                      {data?.duration || "No Duration"}
                    </td>

                    <td className="py-5 px-6 text-gray-300 max-w-xs">
                      <span className="truncate block">
                        {data?.goal || "None"}
                      </span>
                    </td>

                    <td className="py-5 px-6 text-center">
                      <div className="relative flex items-center justify-center gap-3">
                        <Link
                          to={`/UpdateWorkout/${id}`}
                          className="p-2 hover:bg-navy-600 transition-colors text-gray-400 hover:text-lime-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        
                        <Link
                          to={`/Workout/${id}`}
                          className="p-2 hover:bg-navy-600 transition-colors text-gray-400 hover:text-lime-300"
                        >
                          <ArrowRightCircle className="w-4 h-4" />
                        </Link>
                        
                        <button
                          onClick={() => {
                            setDeletingId(id);
                            onDelete(id).finally(() => {
                              setDeletingId(null);
                            });
                          }}
                          disabled={deletingId === id}
                          className="p-2 hover:bg-navy-600 transition-colors text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default Card;