import React from "react";
import HeroImage from "../../../assets/images/h.png";
import { useInView } from "react-intersection-observer";

const HeroSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Animations will trigger every time the element comes into view
    threshold: 0.2, // Trigger when 20% of the section is visible
  });

  return (
    <div
      ref={ref}
      className="relative bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: `url(${HeroImage})`,
        height: "100vh", // Full viewport height
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center">
        <div className="container mx-auto px-6 text-center">
          <h1
            className={`text-5xl md:text-7xl font-extrabold mb-6 ${
              inView ? "animate-fadeIn" : "opacity-0"
            }`}
          >
            Train Smarter. Achieve More.
          </h1>
          <p
            className={`text-lg md:text-2xl text-gray-300 mb-8 ${
              inView ? "animate-fadeIn delay-1" : "opacity-0"
            }`}
          >
            Get personalized workout plans, track your progress, and achieve
            your fitness goals with FitTrack.
          </p>
          <div
            className={`flex justify-center space-x-4 ${
              inView ? "animate-fadeIn delay-2" : "opacity-0"
            }`}
          >
            <button className="bg-gradient-to-r from-[#4a90e2] to-[#3b7ac9] text-white px-8 py-4 rounded-full hover:shadow-md hover:scale-105 transition duration-300 font-semibold">
              Get Started
            </button>
            <button className="bg-gradient-to-r from-[#b4e61d] to-[#a4d519] text-white px-8 py-4 rounded-full hover:shadow-md hover:scale-105 transition duration-300 font-semibold">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Waves */}
      <svg
        className="absolute bottom-0 left-0 w-full h-32 -z-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#0b1129"
          fillOpacity="1"
          d="M0,224L60,213.3C120,203,240,181,360,176C480,171,600,181,720,197.3C840,213,960,235,1080,240C1200,245,1320,235,1380,229.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>

      {/* Animations */}
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
        .animate-fadeIn.delay-1 {
          animation-delay: 0.5s;
        }
        .animate-fadeIn.delay-2 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
