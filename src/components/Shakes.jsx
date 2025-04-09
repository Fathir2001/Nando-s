import React from "react";
import { getImageUrl } from "../utils/imageUtils";
import DishesCard from "../layouts/DishesCard";

// Create shake data objects with proper image references
const shakeData = [
  { id: 1, img: "shake1.webp", title: "Mango Milkshake", price: "LKR 520" },
  { id: 2, img: "shake2.jpg", title: "Lassie Salt & Sweet", price: "LKR 420" },
  { id: 3, img: "shake3.jpg", title: "Mango Lassi", price: "LKR 520" },
  { id: 4, img: "shake4.jpg", title: "Ice Coffee", price: "LKR 490" },
  { id: 5, img: "shake5.jpg", title: "Faluda", price: "LKR 430" },
  { id: 6, img: "shake6.jpg", title: "Ice Milo", price: "LKR 450" },
  { id: 7, img: "shake7.jpg", title: "Badam Milkshake", price: "LKR 520" },
  { id: 8, img: "shake8.webp", title: "Sweet Lassi", price: "LKR 450" },
];

const Shakes = () => {
  return (
    <div className="min-h-screen py-16 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
      <h1 className="text-3xl md:text-4xl font-semibold text-center pt-16 md:pt-24 pb-8 md:pb-10">
        Milkshakes
      </h1>

      <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 lg:gap-8 justify-center">
        {shakeData.map((shake) => (
          <DishesCard 
            key={shake.id}
            img={getImageUrl(shake.img)} 
            title={shake.title} 
            price={shake.price} 
          />
        ))}
      </div>
    </div>
  );
};

export default Shakes;