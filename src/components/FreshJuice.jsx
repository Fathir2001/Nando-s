// eslint-disable-next-line no-unused-vars
import React from "react";
import juice1 from "../assets/img/juice1.jpg";
import juice2 from "../assets/img/juice2.jpg";
import juice3 from "../assets/img/juice3.jpg";
import juice4 from "../assets/img/juice4.jpg";
import juice5 from "../assets/img/juice5.jpg";
import juice6 from "../assets/img/juice6.jpg";
import DishesCard from "../layouts/DishesCard";

const FreshJuice = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
      <h1 className="text-4xl font-semibold text-center pt-24 pb-10">
        Fresh Juices
      </h1>

      <div className="flex flex-wrap gap-8 justify-center">
        <DishesCard img={juice1} title="Orange Juice" price="$4.99" />
        <DishesCard img={juice2} title="Strawberry Smoothie" price="$5.99" />
        <DishesCard img={juice3} title="Mango Paradise" price="$5.49" />
        <DishesCard img={juice4} title="Berry Blast" price="$5.99" />
        <DishesCard img={juice5} title="Green Detox" price="$6.99" />
        <DishesCard img={juice6} title="Tropical Punch" price="$5.49" />
      </div>
    </div>
  );
};

export default FreshJuice;