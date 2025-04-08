import React from "react";

const ReviewCard = (props) => {
  return (
    <div className="w-full h-full bg-white border border-gray-200 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col h-full justify-between">
        <div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {props.review || "Lorem ipsum dolor sit amet consectetur adipisicing elit. In consectetur error, dolores quae ipsa quos enim corporis magni obcaecati tempore natus eos, libero ducimus nulla neque eaque maxime nam molestias?"}
          </p>
        </div>

        <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
          <img 
            className="rounded-full w-12 h-12 object-cover" 
            src={props.img} 
            alt={props.name} 
            loading="lazy"
          />
          <h3 className="font-semibold ml-3">{props.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;