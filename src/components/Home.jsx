import React from "react";
import Button from "../layouts/Button";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-row justify-between items-center px-4 sm:px-8 md:px-16 lg:px-32 relative">
      {/* Mobile background image (hidden on medium screens and up) */}
      <div 
        className="absolute inset-0 bg-[url('./assets/img/PhoneBG.jpg')] bg-cover bg-no-repeat bg-center md:hidden"
        aria-hidden="true"
      ></div>
      
      {/* Desktop background image (hidden on small screens) */}
      <div 
        className="absolute inset-0 hidden md:block bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat bg-center"
        aria-hidden="true"
      ></div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-70 md:opacity-20 lg:opacity-10"></div>
      
      <div className="w-full lg:w-2/3 space-y-6 md:space-y-5 relative z-10">
        <h1 className="text-white md:text-backgroundColor text-5xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Elevate Your Inner Foodie with Every Bite.
        </h1>
        <p className="text-white md:text-backgroundColor text-lg sm:text-lg md:text-lg max-w-xl font-medium leading-relaxed">
          From the moment you step in, our carefully curated ambience will make
          you feel right at home. Whether you're dining with family, friends, or
          colleagues, the warm, inviting atmosphere is the perfect backdrop for
          any occasion
        </p>
        <div className="pt-4 lg:pl-44">
          <Button title="Order Now" />
        </div>
      </div>
    </div>
  );
};

export default Home;