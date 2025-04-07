// eslint-disable-next-line no-unused-vars
import React from "react";
import shake1 from "../assets/img/shake1.webp";
import shake2 from "../assets/img/shake2.jpg";
import shake3 from "../assets/img/shake3.jpg";
import shake4 from "../assets/img/shake4.jpg";
import shake5 from "../assets/img/shake5.jpg";
import shake6 from "../assets/img/shake6.jpg";
import shake7 from "../assets/img/shake7.jpg";
import shake8 from "../assets/img/shake8.webp";

import DishesCard from "../layouts/DishesCard";

const Shakes = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
      <h1 className="text-4xl font-semibold text-center pt-24 pb-10">
        Milkshakes
      </h1>

      <div className="flex flex-wrap gap-8 justify-center">
        <DishesCard img={shake1} title="Mango Milkshake" price="520 LKR" />
        <DishesCard img={shake2} title="Lassie Salt & Sweet" price="420 LKR" />
        <DishesCard img={shake3} title="Mango Lassi" price="520 LKR" />
        <DishesCard img={shake4} title="Ice Coffee" price="490 LKR" />
        <DishesCard img={shake5} title="Faluda" price="430 LKR" />
        <DishesCard img={shake6} title="Ice Milo" price="450 LKR" />
        <DishesCard img={shake7} title="Badam Milkshake" price="520 LKR" />
        <DishesCard img={shake8} title="Sweet Lassi" price="450 LKR" />
      </div>
    </div>
  );
};

export default Shakes;