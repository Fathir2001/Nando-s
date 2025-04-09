import React from "react";
import Button from "../layouts/Button";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center px-4 sm:px-8 md:px-16 lg:px-32 relative overflow-hidden">
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

      <div className="w-full lg:w-2/3 space-y-6 md:space-y-5 relative z-10 mt-24">
        <motion.h1
          className="text-white md:text-backgroundColor text-5xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Elevate Your Inner Foodie with Every Bite.
        </motion.h1>

        <motion.p
          className="text-white md:text-backgroundColor text-lg sm:text-lg md:text-lg max-w-xl font-medium leading-relaxed"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          From the moment you step in, our carefully curated ambience will make
          you feel right at home. Whether you're dining with family, friends, or
          colleagues, the warm, inviting atmosphere is the perfect backdrop for
          any occasion
        </motion.p>

        <motion.div
          className="pt-4 lg:pl-44"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button title="Order Now" />
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <p className="text-white md:text-backgroundColor text-sm font-medium mb-2">
          Scroll Down
        </p>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <FaChevronDown className="text-white md:text-backgroundColor text-2xl" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
