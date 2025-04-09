import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { BsFacebook } from "react-icons/bs";
import { RiTwitterXFill } from "react-icons/ri";
import { BsInstagram } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-black text-white rounded-t-3xl mt-8 md:mt-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 p-8 md:px-16 lg:px-32">
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <h1 className="font-semibold text-xl pb-4">NANDO'S</h1>
          <p className="text-sm max-w-xs">
            Indulge in a symphony of flavors, where each plate is a canvas for
            culinary excellence.
          </p>
        </div>

        <div>
          <h1 className="font-medium text-xl pb-4">Links</h1>
          <nav className="flex flex-col gap-2">
            <ScrollLink
              to="home"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Home
            </ScrollLink>
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
          </nav>
        </div>

        <div>
          <h1 className="font-medium text-xl pb-4">Menu</h1>
          <nav className="flex flex-col gap-2">
            <ScrollLink
              to="dishes"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Dishes
            </ScrollLink>
            <ScrollLink
              to="freshjuice"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Fresh Juices
            </ScrollLink>
            <ScrollLink
              to="shakes"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Milkshakes
            </ScrollLink>
            <ScrollLink
              to="desserts"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
            >
              Desserts
            </ScrollLink>
          </nav>
        </div>

        <div>
          <h1 className="font-medium text-xl pb-4">Contact Us</h1>
          <nav className="flex flex-col gap-2">
            <a
              className="hover:text-brightColor transition-all cursor-pointer"
              href="mailto:nando's@gmail.com"
            >
              nando's@gmail.com
            </a>
            <a
              className="hover:text-brightColor transition-all cursor-pointer"
              href="tel:+94757521997"
            >
              +94 757521997
            </a>
            <div className="flex gap-3 mt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61573905344080"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsFacebook
                  size={20}
                  className="hover:text-brightColor transition-all"
                />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiTwitterXFill
                  size={20}
                  className="hover:text-brightColor transition-all"
                />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsInstagram
                  size={20}
                  className="hover:text-brightColor transition-all"
                />
              </a>
            </div>
          </nav>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <p className="text-center py-4 px-4 text-sm">
          @copyright developed by
          <a
            href="https://fathir2001.github.io/Portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brightColor hover:text-orange-400 transition-all"
          >
            {" "}
            Rifthan Fathir
          </a>{" "}
          | All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
