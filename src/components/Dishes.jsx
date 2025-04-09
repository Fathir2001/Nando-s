import React from "react";
import { getImageUrl } from "../utils/imageUtils";
import DishesCard from "../layouts/DishesCard";

// Create dish data objects with proper image references
const dishesData = [
  { id: 1, img: "dish1.jpg", title: "BBQ", price: "LKR 700" },
  { id: 2, img: "dish2.jpg", title: "Chicken Submarine", price: "LKR 650" },
  { id: 3, img: "dish3.jpg", title: "Chicken Burger", price: "LKR 550" },
  { id: 4, img: "dish4.jpg", title: "Crispy Chicken Burger", price: "LKR 700" },
  { id: 5, img: "dish5.jpg", title: "Chicken Fried Rice", price: "LKR 850" },
  { id: 6, img: "dish6.jpg", title: "Beef Fried Rice", price: "LKR 900" },
  { id: 7, img: "dish7.jpg", title: "Egg Fried Rice", price: "LKR 700" },
  { id: 8, img: "dish8.jpg", title: "Chicken Noodles", price: "LKR 850" },
  { id: 9, img: "dish9.jpg", title: "Beef Noodles", price: "LKR 950" },
  { id: 10, img: "dish10.jpg", title: "Egg Noodles", price: "LKR 700" },
  { id: 11, img: "dish11.jpg", title: "Chicken Dolphin", price: "LKR 900" },
  { id: 12, img: "dish12.jpeg", title: "Beef Dolphin", price: "LKR 900" },
];

const Dishes = () => {
  return (
    <div className="min-h-screen py-8 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
      <h1 className="text-3xl md:text-4xl font-semibold text-center pt-8 md:pt-12 pb-8 md:pb-10">
        Our Dishes
      </h1>

      <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 lg:gap-8 justify-center">
        {dishesData.map((dish) => (
          <DishesCard 
            key={dish.id}
            img={getImageUrl(dish.img)} 
            title={dish.title} 
            price={dish.price} 
          />
        ))}
      </div>
    </div>
  );
};

export default Dishes;