import React, { useState } from "react";
import { useInView } from "react-intersection-observer";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: false, // Trigger animation every time section comes into view
    threshold: 0.2, // Animation triggers when 20% of the section is visible
  });

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does FitTrack work?",
      answer:
     "FitTrack offers predefined plans and uses advanced AI technology to create personalized workout routines, track your progress, and provide insights tailored to your fitness goals"
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, it's currently free to use.",
    },
{    
      question: "Can I customize my workout plans?",
      answer:
      "Absolutely! FitTrack lets you customize workout plans based on your fitness level and goals using AI, and also helps you schedule your workouts."
    },
    {
      question: "What support options are available?",
      answer:
        "We provide 24/7 customer support through live chat, email, and our help center to assist with any inquiries or issues.",
    },
  ];

  return (
    <div
      ref={ref}
      className="py-20 bg-gradient-to-br from-[#112240] to-[#0b1129] text-white px-8 md:px-16 relative overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-[#4a90e2]/20 rounded-full blur-[200px] -z-10"></div>

      <div className="container mx-auto max-w-4xl">
        {/* Heading */}
        <h2
          className={`text-5xl font-extrabold mb-6 text-center tracking-wide ${
            inView ? "animate-slideInFromTop" : "opacity-0"
          }`}
        >
          Frequently Asked Questions
        </h2>
        <p
          className={`text-lg text-gray-300 mb-12 text-center leading-relaxed ${
            inView ? "animate-fadeIn delay-1" : "opacity-0"
          }`}
        >
          Have questions? We've got answers. Check out some of the most common
          inquiries about FitTrack below.
        </p>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md transition-all duration-300 transform ${
                activeIndex === index
                  ? "bg-gradient-to-br from-[#4a90e2] to-[#1a2c50] shadow-xl scale-105"
                  : "bg-[#1a2c50] hover:bg-[#273f60]"
              } ${inView ? "animate-fadeIn delay-2" : "opacity-0"}`}
            >
              {/* Question */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3
                  className={`text-xl font-bold transition-colors duration-300 ${
                    activeIndex === index ? "text-white" : "text-gray-300"
                  }`}
                >
                  {faq.question}
                </h3>
                <span
                  className={`text-3xl font-bold transition-transform duration-300 ${
                    activeIndex === index ? "rotate-45" : "rotate-0"
                  } text-[#b4e61d]`}
                >
                  +
                </span>
              </div>

              {/* Answer */}
              {activeIndex === index && (
                <p className="text-gray-300 mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
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

export default FAQSection;
