import React, { useRef, useState } from 'react';
import { AlignLeft, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Card = ({ exercises, onDelete }) => {

  const [showActionsForId, setShowActionsForId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const containerRef = useRef(null);
  const actionMenuRefs = useRef({});

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
          Exercise Library
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-navy-700 text-left">
                <th className="py-3 pl-4 pr-6 text-gray-400 font-medium text-lg">Exercise</th>
                <th className="py-3 px-4 text-gray-400 font-medium text-lg">Category</th>
                <th className="py-3 px-4 text-gray-400 font-medium text-lg">Difficulty</th>
                <th className="py-3 px-4 text-gray-400 font-medium text-lg">Equipment</th>
                <th className="py-3 px-4 text-gray-400 font-medium text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((data) => {
                const imageUrl = data?.imagePath ? data.imagePath.replace(/\\/g, "/") : "";
                const id = data.id || data._id;
                
                return (
                  <tr 
                    key={id} 
                    className="border-b border-navy-700 hover:bg-navy-700/50 transition-colors"
                  >
                    <td className="py-4 pl-4 pr-6">
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
                            {data?.instructions
                              ? data.instructions.substring(0, 50) + (data.instructions.length > 50 ? "..." : "")
                              : "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-lg text-gray-300">
                      {data?.category || "Uncategorized"}
                    </td>
                    
                    <td className="py-4 px-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyClass(data?.difficulty_level)}`}>
                        {data?.difficulty_level || "Unknown"}
                      </span>
                    </td>
                    
                    <td className="py-4 px-4 text-gray-300 max-w-xs">
                      <span className="truncate block">
                        {data?.equipment || "None"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="relative">
                        <button
                          onClick={() => {
                            const newOpenMenuId = showActionsForId === id ? null : id;
                            setShowActionsForId(newOpenMenuId);
                          }}
                          className="p-2 rounded-md hover:bg-navy-600 transition-colors"
                          aria-label="More options"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>

                        {showActionsForId === id && (
                          <div
                            ref={(el) => { if (el) actionMenuRefs.current[id] = el; }}
                            className="absolute right-0 w-40 bg-navy-900 rounded-md shadow-lg z-50 border border-navy-600"
                            style={{
                              transform: 'translateX(-10%) translateY(10%)',
                            }}
                          >
                            <div className="py-1">
                              <Link
                                to={`/edit/${id}`}
                                className="flex items-center px-4 py-3 text-gray-300 hover:bg-navy-700 hover:text-lime-300 transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-3" />
                                Edit
                              </Link>
                              <button
                                onClick={() => {
                                  setDeletingId(id);
                                  onDelete(id).finally(() => {
                                    setDeletingId(null);
                                  });
                                }}
                                disabled={deletingId === id}
                                className="flex items-center w-full text-left px-4 py-3 text-red-400 hover:bg-navy-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                {deletingId === id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </div>
                        )}
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