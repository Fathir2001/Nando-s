import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Button = ({ title, to }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Handle the Order Now button click
  const handleOrderNowClick = () => {
    if (title === "Order Now") {
      if (currentUser) {
        // If user is logged in, scroll to dishes section
        const dishesSection = document.getElementById('dishes');
        if (dishesSection) {
          dishesSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If user is not logged in, navigate to login page
        navigate("/login");
      }
    }
  };
  
  // For Order Now button, use a direct button with click handler
  if (title === "Order Now") {
    return (
      <button 
        onClick={handleOrderNowClick}
        className="px-6 py-2 border-2 border-brightColor text-brightColor hover:bg-brightColor hover:text-white transition-all rounded-full"
      >
        {title}
      </button>
    );
  }
  
  // For all other buttons (like Login), use the Link component
  return (
    <Link to={to || "/"}>
      <button className="px-6 py-2 border-2 border-brightColor text-brightColor hover:bg-brightColor hover:text-white transition-all rounded-full">
        {title}
      </button>
    </Link>
  );
};

export default Button;