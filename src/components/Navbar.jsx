/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import { BiRestaurant } from "react-icons/bi";
import Button from "../layouts/Button";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { BiChevronDown, BiUserCircle } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="fixed w-full">
      <div>
        <div className="flex flex-row justify-between p-5 md:px-32 px-5 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="flex flex-row items-center cursor-pointer">
            <span>
              <BiRestaurant size={45} className="text-brightColor" />
            </span>
            <h1 className="text-xl font-semibold">NANDO&#39;S</h1>
          </div>

          <nav className="hidden md:flex flex-row items-center text-lg font-medium gap-8">
            <ScrollLink
              to="home"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Home
            </ScrollLink>

            <div className="relative group">
              <div className="flex items-center gap-1">
                <ScrollLink
                  to="dishes"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="hover:text-brightColor transition-all cursor-pointer"
                >
                  Dishes
                </ScrollLink>

                <BiChevronDown className="cursor-pointer" size={25} />
              </div>

              <ul className="absolute hidden space-y-2 group-hover:block bg-white border border-gray-300 rounded-lg p-5">
                <li>
                  <ScrollLink
                    to="dishes"
                    spy={true}
                    smooth={true}
                    duration={500}
                    className="text-gray-800 hover:text-brightColor transition-all cursor-pointer"
                  >
                    Spicy
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="dishes"
                    spy={true}
                    smooth={true}
                    duration={500}
                    className="text-gray-800 hover:text-brightColor transition-all cursor-pointer"
                  >
                    Tasty
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="dishes"
                    spy={true}
                    smooth={true}
                    duration={500}
                    className="text-gray-800 hover:text-brightColor transition-all cursor-pointer"
                  >
                    Delicious
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="dishes"
                    spy={true}
                    smooth={true}
                    duration={500}
                    className="text-gray-800 hover:text-brightColor transition-all cursor-pointer"
                  >
                    Crispy
                  </ScrollLink>
                </li>
              </ul>
            </div>

            <ScrollLink
              to="about"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              About
            </ScrollLink>

            <ScrollLink
              to="menu"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Menu
            </ScrollLink>

            <ScrollLink
              to="review"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Reviews
            </ScrollLink>

            {currentUser ? (
              <div className="relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <BiUserCircle size={30} className="text-brightColor" />
                  <span>{currentUser.displayName || "User"}</span>
                  <BiChevronDown className="cursor-pointer" size={20} />
                </div>
                {showUserMenu && (
                  <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg p-2 shadow-lg">
                    <li className="py-2 px-4 hover:bg-gray-100 rounded-md">
                      <Link to="/profile" className="block">Profile</Link>
                    </li>
                    <li className="py-2 px-4 hover:bg-gray-100 rounded-md">
                      <Link to="/orders" className="block">My Orders</Link>
                    </li>
                    <li className="py-2 px-4 hover:bg-gray-100 rounded-md border-t border-gray-200 mt-1 pt-3">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left text-red-500"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Button title="Login" to="/login" />
            )}
          </nav>

          <div className="md:hidden flex items-center">
            {menu ? (
              <AiOutlineClose size={25} onClick={handleChange} />
            ) : (
              <AiOutlineMenuUnfold size={25} onClick={handleChange} />
            )}
          </div>
        </div>
        <div
          className={` ${
            menu ? "translate-x-0" : "-translate-x-full"
          } lg:hidden flex flex-col absolute bg-black text-white left-0 top-20 font-semibold text-2xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300`}
        >
          <ScrollLink
            to="home"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-brightColor transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Home
          </ScrollLink>
          <ScrollLink
            to="dishes"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-brightColor transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Dishes
          </ScrollLink>
          <ScrollLink
            to="about"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-brightColor transition-all cursor-pointer"
            onClick={closeMenu}
          >
            About
          </ScrollLink>
          <ScrollLink
            to="menu"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-brightColor transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Menu
          </ScrollLink>
          <ScrollLink
            to="review"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-brightColor transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Reviews
          </ScrollLink>

          {currentUser ? (
            <>
              <Link 
                to="/profile" 
                className="hover:text-brightColor transition-all cursor-pointer"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 border-2 border-brightColor text-brightColor hover:bg-brightColor hover:text-white transition-all rounded-full mx-auto"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Button title="Login" to="/login" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;