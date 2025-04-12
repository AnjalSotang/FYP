import React from "react";
import { useInView } from "react-intersection-observer";

const CTASection = () => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Animations re-trigger every time section comes into view
    threshold: 0.2, // Trigger when 20% of the section is visible
  });

  return (
    <div
      ref={ref}
      className="py-20 bg-gradient-to-br from-[#4a90e2] to-[#b4e61d] text-white px-8 md:px-16"
    >
      <div className="container mx-auto max-w-4xl text-center">
        {/* Header */}
        <h2
          className={`text-5xl font-extrabold mb-6 tracking-wide ${
            inView ? "animate-slideInFromTop" : "opacity-0"
          }`}
        >
          Ready to Start Your Journey?
        </h2>
        <p
          className={`text-lg md:text-xl text-gray-100 mb-12 leading-relaxed max-w-3xl mx-auto ${
            inView ? "animate-fadeIn delay-1" : "opacity-0"
          }`}
        >
          Whether you're setting new goals, aiming for a healthier lifestyle, or
          just exploring new horizons, we're here to guide you every step of
          the way. Let’s make today the first step toward a better tomorrow.
        </p>

        {/* Call-to-Action Buttons */}
        <div
          className={`flex flex-col md:flex-row justify-center items-center gap-6 ${
            inView ? "animate-fadeIn delay-2" : "opacity-0"
          }`}
        >
          <a
            href="/get-started"
            className="bg-white text-[#112240] font-semibold text-lg py-3 px-10 rounded-full hover:bg-gray-200 shadow-lg transition duration-300"
          >
            Get Started
          </a>
          <a
            href="/learn-more"
            className="bg-[#112240] text-white font-semibold text-lg py-3 px-10 rounded-full hover:bg-gray-800 shadow-lg transition duration-300"
          >
            Learn More
          </a>
        </div>
      </div>

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
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
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
        .animate-slideInFromTop {
          animation: slideInFromTop 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default CTASection;
