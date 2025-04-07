// eslint-disable-next-line no-unused-vars
import React from "react";
import dish1 from "../assets/img/dish1.jpg";
import dish2 from "../assets/img/dish2.jpg";
import dish3 from "../assets/img/dish3.jpg";
import dish4 from "../assets/img/dish4.jpg";
import dish5 from "../assets/img/dish5.jpg";
import dish6 from "../assets/img/dish6.jpg";
import dish7 from "../assets/img/dish7.jpg";
import dish8 from "../assets/img/dish8.jpg";
import dish9 from "../assets/img/dish9.jpg";
import dish10 from "../assets/img/dish10.jpg";
import dish11 from "../assets/img/dish11.jpg";
import dish12 from "../assets/img/dish12.jpeg";
import DishesCard from "../layouts/DishesCard";

const Dishes = () => {
  return (
    <div className=" min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
      <h1 className=" text-4xl font-semibold text-center pt-24 pb-10">
        Our Dishes
      </h1>

      <div className=" flex flex-wrap gap-8 justify-center">
        <DishesCard img={dish1} title="Tasty Dish" price="$10.99" />
        <DishesCard img={dish2} title="Tasty Dish" price="$12.99" />
        <DishesCard img={dish3} title="Tasty Dish" price="$10.99" />
        <DishesCard img={dish4} title="Tasty Dish" price="$11.99" />
        <DishesCard img={dish5} title="Tasty Dish" price="$10.99" />
        <DishesCard img={dish6} title="Tasty Dish" price="$12.99" />
        <DishesCard img={dish7} title="Tasty Dish" price="$10.99" />
        <DishesCard img={dish8} title="Tasty Dish" price="$12.99" />
        <DishesCard img={dish9} title="Tasty Dish" price="$10.99" />
        <DishesCard img={dish10} title="Tasty Dish" price="$11.99" />
        <DishesCard img={dish11} title="Tasty Dish" price="$10.99" />
        <DishesCard img={dish12} title="Tasty Dish" price="$12.99" />
      </div>
    </div>
  );
};

export default Dishes;
