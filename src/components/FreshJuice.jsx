import React from "react";
import { getImageUrl } from "../utils/imageUtils";
import DishesCard from "../layouts/DishesCard";

// Create juice data objects with proper image references
const juiceData = [
  { id: 1, img: "juice1.jpg", title: "Orange", price: "LKR 530" },
  { id: 2, img: "juice2.jpg", title: "Mango", price: "LKR 390" },
  { id: 3, img: "juice3.jpg", title: "Lime with Mint", price: "LKR 450" },
  { id: 4, img: "juice4.jpg", title: "Watermelon", price: "LKR 340" },
  { id: 5, img: "juice5.jpg", title: "Lime", price: "LKR 320" },
  { id: 6, img: "juice6.jpg", title: "Mixed Fruit", price: "LKR 450" },
  { id: 7, img: "juice7.jpg", title: "Avacado", price: "LKR 380" },
  { id: 8, img: "juice8.jpg", title: "Papaya", price: "LKR 380" },
];

const FreshJuice = () => {
  return (
    <div className="min-h-screen py-16 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
      <h1 className="text-3xl md:text-4xl font-semibold text-center pt-16 md:pt-24 pb-8 md:pb-10">
        Fresh Juices
      </h1>

      <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 lg:gap-8 justify-center">
        {juiceData.map((juice) => (
          <DishesCard 
            key={juice.id}
            img={getImageUrl(juice.img)} 
            title={juice.title} 
            price={juice.price} 
          />
        ))}
      </div>
    </div>
  );
};

export default FreshJuice;