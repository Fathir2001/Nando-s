import React from "react";
import { Link } from "react-router-dom";

const Button = ({ title, to }) => {
  return (
    <Link to={to || "/"}>
      <button className="px-6 py-1 border-2 border-brightColor text-brightColor hover:bg-brightColor hover:text-white transition-all rounded-full">
        {title}
      </button>
    </Link>
  );
};

export default Button;