// eslint-disable-next-line no-unused-vars
import React from "react";
import dessert1 from "../assets/img/dessert1.jpg";
import dessert2 from "../assets/img/dessert2.jpg";
import dessert3 from "../assets/img/dessert3.jpg";
import DishesCard from "../layouts/DishesCard";

const Desserts = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
      <h1 className="text-4xl font-semibold text-center pt-24 pb-10">
        Our Desserts
      </h1>

      <div className="flex flex-wrap gap-8 justify-center">
        <DishesCard img={dessert1} title="Fruit Salad" price="420 LKR" />
        <DishesCard img={dessert2} title="Wattalappam" price="150 LKR" />
        <DishesCard img={dessert3} title="Ice Cream" price="300 LKR" />
      </div>
    </div>
  );
};

export default Desserts;