import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { FaCartPlus, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import { getStorableImageName } from "../utils/imageUtils";

const DishesCard = (props) => {
  const { currentUser } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = async () => {
    if (!currentUser) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      setIsAdding(true);

      // Check if the item is already in the user's cart
      const cartRef = collection(db, "cart");
      const q = query(
        cartRef,
        where("userId", "==", currentUser.uid),
        where("itemName", "==", props.title)
      );

      const querySnapshot = await getDocs(q);

      // Extract price value
      const priceValue = parseFloat(props.price.replace("LKR ", ""));

      if (querySnapshot.empty) {
        // Store a clean reference to the image
        const imageReference = getStorableImageName(props.img);

        // Item is not in cart, add new item
        const itemData = {
          userId: currentUser.uid,
          itemName: props.title,
          price: priceValue,
          quantity: 1,
          image: imageReference,
          addedAt: new Date(),
        };

        console.log("Adding new item to cart:", itemData);
        await addDoc(cartRef, itemData);
        toast.success(`${props.title} added to cart!`);
      } else {
        // Item exists in cart, update quantity
        const cartItem = querySnapshot.docs[0];
        console.log(`Updating quantity for item: ${cartItem.id}`);

        await updateDoc(doc(db, "cart", cartItem.id), {
          quantity: increment(1),
        });

        toast.info(`${props.title} quantity updated in cart!`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);

      // More detailed error messages
      if (error.code === "permission-denied") {
        toast.error(
          "Permission denied. Please check your account permissions."
        );
      } else if (error.code === "unavailable") {
        toast.error("Network issue. Please check your connection.");
      } else {
        toast.error(`Failed to add item: ${error.message}`);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-[48%] sm:w-[45%] md:w-[30%] lg:w-[23%] xl:w-[22%] p-3 sm:p-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg transition-transform hover:scale-[1.02] bg-white">
      <div className="aspect-[4/3] overflow-hidden rounded-xl">
        <img
          className="w-full h-full object-cover rounded-xl"
          src={props.img}
          alt={props.title}
          loading="lazy"
          onError={(e) => {
            console.error(`Image failed to load: ${props.img}`);
            e.target.src = "/assets/placeholder.jpg";
          }}
        />
      </div>
      <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
        <h3 className="font-semibold text-center text-lg sm:text-xl truncate">
          {props.title}
        </h3>
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
            <button
              onClick={addToCart}
              disabled={isAdding}
              className="p-2 text-white bg-brightColor rounded-full hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brightColor"
              aria-label="Add to cart"
            >
              {isAdding ? (
                <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              ) : (
                <FaCartPlus size={18} />
              )}
            </button>
          ) : (
            <div className="relative group">
              <button
                disabled
                className="p-2 text-white bg-gray-400 rounded-full cursor-not-allowed opacity-60"
                aria-label="Login required"
              >
                <FaLock size={16} />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg whitespace-nowrap font-medium">
                  Please login to add items to cart
                </div>
                <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishesCard;
