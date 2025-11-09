import React from "react";
import HeroSection from "./Components/HeroSection";
import FeaturesSection from "./Components/Features";
import AboutUsSection from "./Components/About";
import CTASection from "./Components/Cta";
import FAQSection from "./Components/Faq";
import ContactUsSection from "./Components/ContactUs";
import Layout from "../../components/layout/Layout";

const Landing = () => {
  return (
      <Layout>
      <HeroSection/>  
      <FeaturesSection/>
      <AboutUsSection/>
      <CTASection/>
      <FAQSection/>
      <ContactUsSection/>
      </Layout>
  );
};

export default Landing;
