import React from "react";
import HeroSection from "../../components/Landing/HeroSection";
import FeaturesSection from "../../components/Landing/Features";
import AboutUsSection from "../../components/Landing/About";
import CTASection from "../../components/Landing/CTA";
import FAQSection from "../../components/Landing/Faq";
import ContactUsSection from "../../components/Landing/ContactUs";
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
