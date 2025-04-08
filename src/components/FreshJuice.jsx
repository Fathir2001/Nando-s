// eslint-disable-next-line no-unused-vars
import React from "react";
import juice1 from "../assets/img/juice1.jpg";
import juice2 from "../assets/img/juice2.jpg";
import juice3 from "../assets/img/juice3.jpg";
import juice4 from "../assets/img/juice4.jpg";
import juice5 from "../assets/img/juice5.jpg";
import juice6 from "../assets/img/juice6.jpg";
import juice7 from "../assets/img/juice7.jpg";
import juice8 from "../assets/img/juice8.jpg";
import DishesCard from "../layouts/DishesCard";

const FreshJuice = () => {
  return (
    <div className="min-h-screen py-16 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
      <h1 className="text-3xl md:text-4xl font-semibold text-center pt-16 md:pt-24 pb-8 md:pb-10">
        Fresh Juices
      </h1>

      <div className="flex flex-wrap gap-8 justify-center">
        <DishesCard img={juice1} title="Orange" price="530 LKR" />
        <DishesCard img={juice2} title="Mango" price="390 LKR" />
        <DishesCard img={juice3} title="Lime with Mint" price="450 LKR" />
        <DishesCard img={juice4} title="Watermelon" price="340 LKR" />
        <DishesCard img={juice5} title="Lime" price="320 LKR" />
        <DishesCard img={juice6} title="Mixed Fruit" price="450 LKR" />
        <DishesCard img={juice7} title="Avacado" price="380 LKR" />
        <DishesCard img={juice8} title="Papaya" price="380 LKR" />
      </div>
    </div>
  );
};

export default FreshJuice;
