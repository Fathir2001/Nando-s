import React from "react";
import { BsStarFill } from "react-icons/bs";
import { BsStarHalf } from "react-icons/bs";
import Button from "./Button";
import { useAuth } from "../contexts/AuthContext";

const DishesCard = (props) => {
  const { currentUser } = useAuth();

  return (
    <div className="w-[48%] sm:w-[45%] md:w-[30%] lg:w-[23%] xl:w-[22%] p-3 sm:p-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg transition-transform hover:scale-[1.02] bg-white">
      <div className="aspect-[4/3] overflow-hidden rounded-xl">
        <img 
          className="w-full h-full object-cover rounded-xl" 
          src={props.img} 
          alt={props.title}
          loading="lazy" 
        />
      </div>
      <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
        <h3 className="font-semibold text-center text-lg sm:text-xl truncate">{props.title}</h3>
        <div className="flex flex-row justify-center">
          <BsStarFill className="text-brightColor text-sm sm:text-base" />
          <BsStarFill className="text-brightColor text-sm sm:text-base" />
          <BsStarFill className="text-brightColor text-sm sm:text-base" />
          <BsStarFill className="text-brightColor text-sm sm:text-base" />
          <BsStarHalf className="text-brightColor text-sm sm:text-base" />
        </div>
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
          <h3 className="font-semibold text-base sm:text-lg">{props.price}</h3>
          {currentUser ? (
            <Button title="Buy Now" />
          ) : (
            <Button title="Login to Buy" to="/login" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DishesCard;