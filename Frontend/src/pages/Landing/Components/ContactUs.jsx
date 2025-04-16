import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const formRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      
      const response = await fetch('http://localhost:3001/api/addContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#112240] to-[#1a2c50] text-white px-8 md:px-16 flex items-center justify-center relative overflow-hidden">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px] bg-[#4a90e2]/20 rounded-full blur-[200px] -z-10"></div>

      <div
        ref={formRef}
        className={`bg-[#1a2c50] p-10 rounded-xl shadow-lg max-w-3xl w-full transition-all duration-700 transform ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`}
      >
        <h2 className="text-5xl font-bold mb-6 text-center animate-slideIn">
          Contact Us
        </h2>
        <p className="text-lg text-gray-300 mb-8 text-center animate-fadeIn delay-1">
          Got questions? We'd love to hear from you. Fill out the form below,
          and our team will get back to you as soon as possible.
        </p>

        <form className="space-y-6 animate-fadeIn delay-2" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-4 rounded-lg bg-[#0b1129] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-4 rounded-lg bg-[#0b1129] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full p-4 rounded-lg bg-[#0b1129] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
            />
          </div>
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full p-4 rounded-lg bg-[#0b1129] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition"
              rows="5"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#4a90e2] to-[#b4e61d] text-[#112240] font-bold py-3 rounded-lg hover:scale-105 hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
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
        @keyframes slideIn {
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
        .animate-slideIn {
          animation: slideIn 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ContactUsSection;