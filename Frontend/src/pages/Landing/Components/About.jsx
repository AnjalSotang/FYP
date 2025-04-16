import React from "react";
import { useInView } from "react-intersection-observer";
import AboutImage from "../../../assets/images/about.jpeg";

const AboutUsSection = () => {
  const { ref: imageRef, inView: isImageInView } = useInView(); // Removed triggerOnce
  const { ref: textRef, inView: isTextInView } = useInView(); // Removed triggerOnce

  return (
    <div className="py-20 bg-gradient-to-br from-[#112240] to-[#1a2c50] text-white px-8 md:px-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Column: Image */}
        <div
          ref={imageRef}
          className={`w-full md:w-1/2 flex justify-center md:justify-start relative transition duration-1000 ${
            isImageInView ? "animate-slideInFromLeft" : "opacity-0"
          }`}
        >
          <img
            src={AboutImage}
            alt="About Us"
            className="rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 max-w-full z-10"
          />
          {/* Decorative Element */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#4a90e2]/40 to-[#b4e61d]/40 rounded-lg blur-lg -z-10"></div>
        </div>

        {/* Right Column: Text Content */}
        <div
          ref={textRef}
          className={`w-full md:w-1/2 text-center md:text-left transition duration-1000 ${
            isTextInView ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-wide">
            About Us
          </h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            FitTrack is dedicated to empowering individuals to achieve their fitness goals through
            personalized workout plans, advanced progress tracking, and a supportive community.
          </p>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            With cutting-edge AI technology and proven fitness principles, we offer tailored
            solutions that adapt to your unique needs and lifestyle. Whether you're a beginner or a
            seasoned athlete, FitTrack is here to guide you every step of the way.
          </p>
          {/* <button className="bg-[#4a90e2] text-white px-8 py-3 rounded-full hover:bg-[#3b7ac9] font-semibold transition hover:glow">
            Learn More
          </button> */}
        </div>
      </div>
      {/* CSS for Animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-slideInFromLeft {
          animation: slideInFromLeft 1s ease-out forwards;
        }
        .hover\\:glow:hover {
          box-shadow: 0 0 15px rgba(74, 144, 226, 0.8);
        }
      `}</style>
    </div>
  );
};

export default AboutUsSection;
