import React from "react";
import ReviewCard from "../layouts/ReviewCard";
import img1 from "../assets/img/pic1.jpg";
import img2 from "../assets/img/pic2.jpg";
import img3 from "../assets/img/pic3.jpg";

const Review = () => {
  const reviews = [
    {
      img: img1,
      name: "Rifthan Fathir",
      review: "The flavors at Nando's are absolutely incredible! Their BBQ chicken is perfectly spiced and always cooked to perfection. I come back at least twice a month for their quarter chicken with extra hot sauce."
    },
    {
      img: img2,
      name: "Sadam",
      review: "Best dining experience I've had in years. The service is always friendly, the atmosphere is vibrant, and the food is consistently delicious. I highly recommend trying their Fried Rice with a side of Devilled Chicken."
    },
    {
      img: img3,
      name: "Askeen",
      review: "Nando's has become our family's favorite weekend spot. The variety of spice levels means everyone finds something they love, from mild to extra hot. Their bottomless drinks and desserts are also worth trying!"
    }
  ];

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center md:px-32 px-5">
      <h1 className=" text-4xl font-semibold text-center lg:pt-16 pt-24 pb-10">
        Customer's Review
      </h1>
      <div className=" flex flex-col md:flex-row gap-5 mt-5">
        {reviews.map((review, index) => (
          <ReviewCard 
            key={index}
            img={review.img} 
            name={review.name} 
            review={review.review} 
          />
        ))}
      </div>
    </div>
  );
};

export default Review;