import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Confetti from "react-confetti";

const CongratulationsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name") || "Guest"; // Get the user's name from query params

  // Array of motivational quotes to randomize
  const quotes = [
    "The journey of a thousand miles begins with a single step.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Your fitness journey is a marathon, not a sprint. Stay consistent!",
    "Believe you can, and you're halfway there.",
    "Discipline is the bridge between goals and accomplishment.",
  ];

  // Randomize quotes on each render
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    document.title = `Congratulations, ${name}! | FitTrack`;
  }, [name]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1129] to-[#1a2c50] flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Confetti */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={200}
        gravity={0.2}
        colors={["#b4e61d", "#a4d519", "#4a90e2"]}
      />

      {/* Logo */}
      <h1 className="absolute top-10 left-12 text-[#b4e61d] text-5xl font-extrabold tracking-wide drop-shadow-md animate-fade-in">
        FitTrack
      </h1>

      {/* Content Container */}
      <div className="bg-[#112240] py-12 px-10 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-3xl hover:shadow-3xl transition duration-300 text-center relative animate-scale-up">
        {/* User-Specific Greeting */}
        <h1 className="text-5xl font-extrabold text-white mb-6 animate-fade-in-down">
          🎉 Congratulations, {name}! 🎉
        </h1>

        {/* Subheading */}
        <p className="text-xl text-gray-400 mb-6">
          You've successfully completed setting up your FitTrack profile.
        </p>

        {/* Motivational Quote */}
        <div className="bg-[#1a2c50] p-6 rounded-lg mb-8 shadow-inner animate-pulse">
          <p className="text-2xl text-[#a8b3c4] italic">"{randomQuote}"</p>
        </div>

        {/* Glowing Progress Tracker */}
        <div className="mb-8">
          <p className="text-lg text-[#c6d0e1] mb-4">Your Progress:</p>
          <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-[#b4e61d] to-[#a4d519] h-8 rounded-full text-center text-lg font-bold text-[#112240] flex items-center justify-center shadow-glow animate-slide-in"
              style={{ width: "100%" }}
            >
              Profile Setup Complete
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <p className="text-xl text-[#c6d0e1] mb-8">
          You're now one step closer to achieving your fitness goals. Let's make every workout count!
        </p>

        {/* Link to Plan Workout */}
        <Link
          to="/planWorkout"
          className="bg-gradient-to-r from-[#b4e61d] to-[#a4d519] text-[#112240] text-xl font-bold py-4 px-12 rounded-full hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-[#b4e61d] transition duration-300 animate-bounce"
        >
          Plan Your Workout
        </Link>
      </div>

      {/* Styles */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0.8; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes slideIn {
          from { width: 0; }
          to { width: 100%; }
        }

        .animate-fade-in {
          animation: fadeIn 1.5s ease-in;
        }

        .animate-fade-in-down {
          animation: fadeInDown 1.2s ease-in-out;
        }

        .animate-scale-up {
          animation: scaleUp 1s ease-in-out;
        }

        .animate-slide-in {
          animation: slideIn 2s ease-out;
        }

        .shadow-glow {
          box-shadow: 0 0 20px rgba(180, 230, 29, 0.8);
        }
      `}</style>
    </div>
  );
};

export default CongratulationsPage;
