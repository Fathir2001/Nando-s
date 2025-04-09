/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import { BiRestaurant } from "react-icons/bi";
import Button from "../layouts/Button";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { BiChevronDown, BiUserCircle } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const menuDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const handleChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
    setShowMenuDropdown(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const toggleMenuDropdown = () => {
    setShowMenuDropdown(!showMenuDropdown);
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch cart count
  useEffect(() => {
    const getCartCount = async () => {
      if (!currentUser) {
        setCartCount(0);
        return;
      }
      
      try {
        const cartRef = collection(db, "cart");
        const q = query(cartRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        // Sum up quantities of all items
        const totalItems = querySnapshot.docs.reduce((count, doc) => {
          return count + doc.data().quantity;
        }, 0);
        
        setCartCount(totalItems);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };
    
    getCartCount();
  }, [currentUser]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target)) {
        setShowMenuDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : ''}`}>
      <div>
        <div className={`flex flex-row justify-between p-4 md:p-5 md:px-16 lg:px-32 ${!scrolled ? 'bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]' : ''}`}>
          <div className="flex flex-row items-center cursor-pointer">
            <span>
              <BiRestaurant size={40} className="text-brightColor" />
            </span>
            <h1 className="text-lg md:text-xl font-semibold">NANDO&#39;S</h1>
          </div>

          <nav className="hidden md:flex flex-row items-center text-base lg:text-lg font-medium gap-4 lg:gap-8">
            <ScrollLink
              to="home"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Home
            </ScrollLink>

            <div className="relative" ref={menuDropdownRef}>
              <div 
                className="flex items-center gap-1 cursor-pointer hover:text-brightColor transition-all"
                onClick={toggleMenuDropdown}
              >
                <span>Menu</span>
                <BiChevronDown size={20} className={`transform transition-transform ${showMenuDropdown ? 'rotate-180' : ''}`} />
              </div>
              {showMenuDropdown && (
                <ul 
                  className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg py-2 shadow-lg z-50"
                >
                  <li className="py-2 px-4 hover:bg-gray-100 rounded-md">
                    <ScrollLink
                      to="dishes"
                      spy={true}
                      smooth={true}
                      duration={500}
                      className="block cursor-pointer w-full text-left"
                      onClick={() => setShowMenuDropdown(false)}
                    >
                      Dishes
                    </ScrollLink>
                  </li>
                  <li className="py-2 px-4 hover:bg-gray-100 rounded-md">
                    <ScrollLink
                      to="freshjuice"
                      spy={true}
                      smooth={true}
                      duration={500}
                      className="block cursor-pointer w-full text-left"
                      onClick={() => setShowMenuDropdown(false)}
                    >
                      Fresh Juices
                    </ScrollLink>
                  </li>
                  <li className="py-2 px-4 hover:bg-gray-100 rounded-md">
                    <ScrollLink
                      to="shakes"
                      spy={true}
                      smooth={true}
                      duration={500}
                      className="block cursor-pointer w-full text-left"
                      onClick={() => setShowMenuDropdown(false)}
                    >
                      Milkshakes
                    </ScrollLink>
                  </li>
                  <li className="py-2 px-4 hover:bg-gray-100 rounded-md">
                    <ScrollLink
                      to="desserts"
                      spy={true}
                      smooth={true}
                      duration={500}
                      className="block cursor-pointer w-full text-left"
                      onClick={() => setShowMenuDropdown(false)}
                    >
                      Desserts
                    </ScrollLink>
                  </li>
                </ul>
              )}
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
              to="review"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Reviews
            </ScrollLink>

            {currentUser ? (
              <div className="flex items-center gap-4">
                {/* Cart Icon for logged-in users */}
                <Link 
                  to="/cart" 
                  className="relative hover:text-brightColor transition-all"
                  title="View Cart"
                >
                  <FaShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brightColor text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                
                <div className="relative" ref={userMenuRef}>
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-brightColor"
                    onClick={toggleUserMenu}
                  >
                    <BiUserCircle size={28} className="text-brightColor" />
                    <span className="hidden lg:inline">{currentUser.displayName || "User"}</span>
                    <BiChevronDown className="cursor-pointer" size={20} />
                  </div>
                  {showUserMenu && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg p-2 shadow-lg z-50">
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
              </div>
            ) : (
              <Button title="Login" to="/login" />
            )}
          </nav>

          <div className="md:hidden flex items-center">
            {currentUser && (
              <Link 
                to="/cart" 
                className="relative mr-4 hover:text-brightColor transition-all"
                title="View Cart"
              >
                <FaShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brightColor text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            
            {menu ? (
              <AiOutlineClose size={25} onClick={handleChange} className="cursor-pointer" />
            ) : (
              <AiOutlineMenuUnfold size={25} onClick={handleChange} className="cursor-pointer" />
            )}
          </div>
        </div>
        <div
          className={`${
            menu ? "translate-x-0" : "-translate-x-full"
          } lg:hidden flex flex-col fixed bg-black text-white left-0 top-[64px] font-semibold text-xl text-center pt-6 pb-4 gap-6 w-full h-[calc(100vh-64px)] overflow-auto transition-transform duration-300 z-50`}
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
          
          <div className="relative">
            <div 
              className="hover:text-brightColor transition-all cursor-pointer flex items-center justify-center"
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
            >
              Menu <BiChevronDown className={`inline ml-1 transform transition-transform ${showMenuDropdown ? 'rotate-180' : ''}`} />
            </div>
            {showMenuDropdown && (
              <div className="flex flex-col gap-2 mt-2 text-base bg-gray-900 py-2 rounded-md mx-8">
                <ScrollLink
                  to="dishes"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="hover:text-brightColor transition-all cursor-pointer py-2"
                  onClick={closeMenu}
                >
                  Dishes
                </ScrollLink>
                <ScrollLink
                  to="freshjuice"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="hover:text-brightColor transition-all cursor-pointer py-2"
                  onClick={closeMenu}
                >
                  Fresh Juices
                </ScrollLink>
                <ScrollLink
                  to="shakes"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="hover:text-brightColor transition-all cursor-pointer py-2"
                  onClick={closeMenu}
                >
                  Milkshakes
                </ScrollLink>
                <ScrollLink
                  to="desserts"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="hover:text-brightColor transition-all cursor-pointer py-2"
                  onClick={closeMenu}
                >
                  Desserts
                </ScrollLink>
              </div>
            )}
          </div>

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
                to="/cart"
                className="hover:text-brightColor transition-all cursor-pointer flex items-center justify-center gap-2"
                onClick={closeMenu}
              >
                <FaShoppingCart /> Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <Link
                to="/profile"
                className="hover:text-brightColor transition-all cursor-pointer"
                onClick={closeMenu}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="px-6 py-2 border-2 border-brightColor text-brightColor hover:bg-brightColor hover:text-white transition-all rounded-full mx-auto"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div onClick={closeMenu}>
              <Button title="Login" to="/login" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;