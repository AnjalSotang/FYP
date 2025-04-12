import React from "react";
import { useInView } from "react-intersection-observer";
import PersonalizedIcon from "../../../assets/images/Goal.jpg";
import ProgressIcon from "../../../assets/images/Progress.jpg";
import GoalSettingIcon from "../../../assets/images/Planning.jpg";
import CalendarIcon from "../../../assets/images/call.jpg";

const FeaturesSection = () => {
  const { ref: headerRef, inView: isHeaderInView } = useInView();
  const { ref: gridRef, inView: isGridInView } = useInView();

  return (
    <div className="py-20 bg-gradient-to-br from-[#0b1129] to-[#1a2c50] text-white">
      <div className="container mx-auto px-8 md:px-16">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition duration-1000 ${
            isHeaderInView ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-wide">
            🚀 Train Smarter
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Combining cutting-edge AI technology with proven fitness principles to help you unlock your potential.
          </p>
          <div className="mt-6 h-1 w-32 bg-gradient-to-r from-[#4a90e2] to-[#b4e61d] mx-auto rounded-full"></div>
        </div>

        {/* Features Grid */}
        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-20 gap-x-10 transition duration-1000 ${
            isGridInView ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          {/* Feature 1 */}
          <FeatureCard
            icon={PersonalizedIcon}
            title="Personalized Plans"
            description="Get workout plans tailored to your goals, fitness level, and preferences."
          />
          {/* Feature 2 */}
          <FeatureCard
            icon={ProgressIcon}
            title="Progress Tracking"
            description="Monitor your improvements with detailed analytics and visual progress indicators."
          />
          {/* Feature 3 */}
          <FeatureCard
            icon={GoalSettingIcon}
            title="Goal Setting"
            description="Set and achieve your fitness goals with smart reminders to keep you on track."
          />
          {/* Feature 4 */}
          <FeatureCard
            icon={CalendarIcon}
            title="Workout Planning"
            description="Plan and schedule your workouts with ease using our intuitive calendar."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`group bg-[#1a2c50] p-10 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 hover:bg-[#162d60] relative duration-1000 ${
        inView ? "animate-fadeIn" : "opacity-0"
      }`}
    >
      {/* Floating Icon */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#4a90e2] to-[#b4e61d] flex items-center justify-center shadow-lg group-hover:scale-110 transition">
        <img src={icon} alt={title} className="w-14 h-14 rounded-full" />
      </div>

      {/* Content */}
      <div className="mt-10 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 text-lg">{description}</p>
      </div>
    </div>
  );
};

<style jsx="true">{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 1s ease-out forwards;
    opacity: 0;
  }
`}</style>;

export default FeaturesSection;
