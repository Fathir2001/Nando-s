import React from "react";
import img from "../assets/img/about.png";
import Button from "../layouts/Button";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center lg:px-32 px-5">
      <img src={img} alt="img" />

      <div className=" space-y-4 lg:pt-14">
        <h1 className=" font-semibold text-4xl text-center md:text-start">
          Why Choose Us?
        </h1>
        <p>
          At NANDO'S, we believe dining is not just about eating, it's
          about experiencing the perfect blend of taste, ambience, and service.
          Whether you're here for a romantic evening, a family gathering, or a
          corporate event, we strive to provide you with an unforgettable
          experience that goes beyond your expectations.{" "}
        </p>
        <p>
          The perfect meal is complemented by the perfect setting. Our
          restaurant combines elegant decor, cozy seating, and a welcoming
          atmosphere to ensure you feel right at home. Whether you’re here for a
          special occasion or an everyday meal, the experience is designed to
          fit your mood and style.
        </p>
        <div className=" flex justify-center lg:justify-start">
          <Button title="Learn More" />
        </div>
      </div>
    </div>
  );
};

export default About;
