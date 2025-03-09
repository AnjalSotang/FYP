import React from "react";
import { useNavigate } from "react-router-dom";

const Check = ({ 
  title, 
  subtitle, 
  options, 
  selectedOption, 
  selectedOptions = [],  
  toggleOption,  
  buttonText, 
  nextLink 
}) => {
  const navigate = useNavigate();  // ✅ Use React Router navigation

  // ✅ Determine if at least one option is selected
  const isSelectionMade = selectedOption || selectedOptions.length > 0;

  return (
    <div className="bg-[#112240] py-12 px-10 rounded-2xl shadow-lg shadow-black/40 w-full max-w-xl hover:shadow-xl transition duration-300">
        {/* Logo */}
        <h1 className="absolute top-8 left-10 text-[#b4e61d] text-4xl font-bold hover:text-[#a4d519] transition">
                FitTrack
            </h1>

      {/* Heading */}
      {title && <h1 className="text-3xl font-bold text-white text-center mb-6">{title}</h1>}

      {/* Subheading */}
      {subtitle && <p className="text-lg text-gray-400 text-center mb-10">{subtitle}</p>}
      
      {/* Options */}
      <div className="space-y-4 mb-10">
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-full px-6 py-4 rounded-lg text-lg font-medium transition ${
              selectedOption === option || selectedOptions.includes(option) 
                ? "bg-[#4a90e2] text-white shadow-md"
                : "bg-[#1a2c50] text-[#c6d0e1] hover:bg-[#273f60]"
            }`}
            onClick={() => toggleOption(option)} 
          >
            {option}
          </button>
        ))}
      </div>

       {/* Next Button */}
       <div className="flex justify-between items-center mt-12 space-x-6">
        <button
          onClick={() => isSelectionMade && navigate(nextLink)}  // ✅ Only navigate if selection is made
          disabled={!isSelectionMade}  // ✅ Disable button if no selection
          className={`flex-1 text-lg font-semibold py-3 rounded-lg transition duration-300 text-center ${
            isSelectionMade
              ? "bg-gradient-to-r from-[#b4e61d] to-[#a4d519] text-[#112240] hover:scale-105 hover:shadow-md focus:ring-2 focus:ring-[#b4e61d]"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          {buttonText}
        </button>
      </div>
      </div>
  );
};

export default Check;
