import React from "react";
import img from "../assets/img/about.png";
import Button from "../layouts/Button";

const About = () => {
  return (
    <div className="min-h-screen py-16 flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16 px-4 sm:px-8 md:px-16 lg:px-32">
      <div className="w-full lg:w-1/2 flex justify-center">
        <img 
          src={img} 
          alt="About Nando's" 
          className="max-w-full h-auto rounded-lg shadow-lg"
          loading="lazy"
        />
      </div>

      <div className="w-full lg:w-1/2 space-y-4 lg:pt-0 px-0 sm:px-4">
        <h1 className="font-semibold text-3xl md:text-4xl text-center md:text-start">
          Why Choose Us?
        </h1>
        <p className="text-base">
          At NANDO'S, we believe dining is not just about eating, it's
          about experiencing the perfect blend of taste, ambience, and service.
          Whether you're here for a romantic evening, a family gathering, or a
          corporate event, we strive to provide you with an unforgettable
          experience that goes beyond your expectations.
        </p>
        <p className="text-base">
          The perfect meal is complemented by the perfect setting. Our
          restaurant combines elegant decor, cozy seating, and a welcoming
          atmosphere to ensure you feel right at home. Whether you're here for a
          special occasion or an everyday meal, the experience is designed to
          fit your mood and style.
        </p>
        <div className="flex justify-center lg:justify-start pt-2">
          <Button title="Learn More" />
        </div>
      </div>
    </div>
  );
};

export default About;