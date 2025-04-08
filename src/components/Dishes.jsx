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
        <DishesCard img={dish1} title="BBQ" price="LKR 700" />
        <DishesCard img={dish2} title="Chicken Submarine" price="LKR 650" />
        <DishesCard img={dish3} title="Chicken Burger" price="LKR 550" />
        <DishesCard img={dish4} title="Crispy Chicken Burger" price="LKR 700" />
        <DishesCard img={dish5} title="Chicken Fried Rice" price="LKR 850" />
        <DishesCard img={dish6} title="Beef Fried Rice" price="LKR 900" />
        <DishesCard img={dish7} title="Egg Fried Rice" price="LKR 700" />
        <DishesCard img={dish8} title="Chicken Noodles" price="LKR 850" />
        <DishesCard img={dish9} title="Beef Noodles" price="LKR 950" />
        <DishesCard img={dish10} title="Egg Noodles" price="LKR 700" />
        <DishesCard img={dish11} title="Chicken Dolphin" price="LKR 900" />
        <DishesCard img={dish12} title="Beef Dolphin" price="LKR 900" />
      </div>
    </div>
  );
};

export default Dishes;
