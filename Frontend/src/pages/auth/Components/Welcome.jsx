import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
    const { user } = useSelector((state) => state.auth)
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1124] to-[#1a2c50] flex flex-col justify-center items-center px-6">
            {/* Logo */}
            <h1 className="absolute top-10 left-12 text-[#b4e61d] text-5xl font-bold tracking-wide">
                FitTrack
            </h1>

            {/* Content */}
            <div className="text-center max-w-3xl px-6">
                {/* Heading */}
                <h1 className="text-5xl font-extrabold text-white mb-10 leading-tight">
                    Welcome to FitTrack, {user.userName}!
                </h1>

                {/* Subheading */}
                <p className="text-xl text-[#a8b3c4] mb-8">
                    Your personalized fitness journey starts here!
                </p>

                {/* Description */}
                <p className="text-lg text-[#c6d0e1] leading-8 tracking-wide">
                    We’re thrilled to have you on board. Whether you’re a beginner, intermediate, or advanced, FitTrack is here to help you stay on track with your goals, measure your progress, and celebrate your achievements.
                </p>
                <p className="text-lg text-[#c6d0e1] leading-8 tracking-wide mt-6">
                    Let’s make every step count, every workout meaningful, and every goal achievable. Together, we’ll unlock the best version of you!
                </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-6 mt-12">
                {/* Back Button
                <Link
                   to={`/UserName?email=${encodeURIComponent(email)}`}
                    aria-label="Navigate to the previous page"
                    className="px-10 py-4 text-lg font-semibold text-[#1a2c50] bg-gray-300 rounded-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-400 transition duration-300"
                >
                    BACK
                </Link> */}

                {/* Next Button */}
                <button
                    onClick={() => navigate('/register?step=3', { replace: true })}
                    aria-label="Navigate to health setup page"
                    className="px-40 py-4 text-lg font-semibold text-[#112240] bg-gradient-to-r from-[#b4e61d] to-[#a4d519] rounded-lg hover:scale-105 hover:shadow-md focus:ring-2 focus:ring-[#b4e61d] transition duration-300"
                >
                    NEXT
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
