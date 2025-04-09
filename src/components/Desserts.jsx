// eslint-disable-next-line no-unused-vars
import React from "react";
import dessert1 from "../assets/img/dessert1.jpg";
import dessert2 from "../assets/img/dessert2.jpg";
import dessert3 from "../assets/img/dessert3.jpg";
import DishesCard from "../layouts/DishesCard";

const Desserts = () => {
  return (
    <div className="min-h-screen py-16 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
      <h1 className="text-3xl md:text-4xl font-semibold text-center pt-16 md:pt-24 pb-8 md:pb-10">
        Desserts
      </h1>

      <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 lg:gap-8 justify-center">
        <DishesCard img={dessert1} title="Fruit Salad" price="420 LKR" />
        <DishesCard img={dessert2} title="Wattalappam" price="150 LKR" />
        <DishesCard img={dessert3} title="Ice Cream" price="300 LKR" />
      </div>
    </div>
  );
};

export default Desserts;
