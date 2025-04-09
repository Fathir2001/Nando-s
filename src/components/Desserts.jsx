import React from "react";
import { getImageUrl } from "../utils/imageUtils";
import DishesCard from "../layouts/DishesCard";

// Create dessert data objects with proper image references
const dessertData = [
  { id: 1, img: "dessert1.jpg", title: "Fruit Salad", price: "LKR 420" },
  { id: 2, img: "dessert2.jpg", title: "Wattalappam", price: "LKR 150" },
  { id: 3, img: "dessert3.jpg", title: "Ice Cream", price: "LKR 300" },
];

const Desserts = () => {
  return (
    <div className="min-h-screen py-16 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
      <h1 className="text-3xl md:text-4xl font-semibold text-center pt-16 md:pt-24 pb-8 md:pb-10">
        Desserts
      </h1>

      <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 lg:gap-8 justify-center">
        {dessertData.map((dessert) => (
          <DishesCard 
            key={dessert.id}
            img={getImageUrl(dessert.img)} 
            title={dessert.title} 
            price={dessert.price} 
          />
        ))}
      </div>
    </div>
  );
};

export default Desserts;