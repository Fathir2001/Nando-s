import React from "react";
import DishesCard from "../layouts/DishesCard";
import dish1 from "../assets/img/dish1.jpg";
import dish2 from "../assets/img/dish2.jpg";
import dish3 from "../assets/img/dish3.jpg";
import dish4 from "../assets/img/dish4.jpg";
import dish5 from "../assets/img/dish5.jpg";
import dish6 from "../assets/img/dish6.webp";


const Menu = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
      <h1 className=" text-4xl font-semibold text-center lg:pt-8 pt-24 pb-10">
        Premium Menu
      </h1>

      <div className=" flex flex-wrap gap-8 justify-center">
        <DishesCard img={dish1} title="Delicious Dish" price="$16.99" />
        <DishesCard img={dish2} title="Delicious Dish" price="$18.99" />
        <DishesCard img={dish3} title="Delicious Dish" price="$14.99" />
        <DishesCard img={dish4} title="Delicious Dish" price="$16.99" />
        <DishesCard img={dish5} title="Delicious Dish" price="$18.99" />
        <DishesCard img={dish6} title="Delicious Dish" price="$14.99" />
      </div>
    </div>
  );
};

export default Menu;
