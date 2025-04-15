import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaCheckCircle } from "react-icons/fa";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getImageUrl } from "../utils/imageUtils";

const AddToCart = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(150);
  // Add a state for the confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Fetch cart items from Firestore
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser) return;

      try {
        const cartRef = collection(db, "cart");
        const q = query(cartRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCartItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [currentUser]);

  // Calculate subtotal whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Remove item from cart
  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(db, "cart", id));
      setCartItems(cartItems.filter((item) => item.id !== id));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  // Update quantity
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateDoc(doc(db, "cart", id), {
        quantity: newQuantity,
      });

      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  // Calculate total
  const total = subtotal + deliveryFee;

  // Handle opening the confirmation dialog
  const handleConfirmOrder = () => {
    setShowConfirmDialog(true);
  };

  // Handle order submission after confirmation
  const submitOrder = async () => {
    if (cartItems.length === 0) return;

    setProcessing(true);

    try {
      // Create a new order in the orders collection
      const orderData = {
        userId: currentUser.uid,
        items: cartItems.map((item) => ({
          itemName: item.itemName,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          subtotal: item.price * item.quantity,
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        totalAmount: total,
        status: "Pending",
        createdAt: serverTimestamp(),
      };

      // Add the order to Firestore
      const orderRef = await addDoc(collection(db, "orders"), orderData);

      // Get the order ID
      const orderId = orderRef.id;

      // Clear the user's cart
      for (const item of cartItems) {
        await deleteDoc(doc(db, "cart", item.id));
      }

      // Send email notification
      try {
        // Get user profile from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data() || {};

        // Prepare data for email
        const emailData = {
          order: {
            id: orderId,
            ...orderData,
            // Convert Firebase timestamp to string for JSON serialization
            createdAt: new Date().toISOString(),
          },
          user: {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            phone: userData.phone || "",
            address: userData.address || "",
          },
        };

        // Call the serverless function
        await fetch("/.netlify/functions/sendOrderEmail", {
          method: "POST",
          body: JSON.stringify(emailData),
        });

        console.log("Email notification sent");
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // Don't fail the order if email fails
      }

      // Show success message
      toast.success("Order placed successfully!");

      // Redirect to home or order confirmation page
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
      setShowConfirmDialog(false);
    } finally {
      setProcessing(false);
    }
  };

  // ...existing code...
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-10 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brightColor"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-10 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-gray-600 hover:text-brightColor"
          >
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Your cart is empty
              </h3>
              <p className="mt-2 text-gray-500">
                Looks like you haven't added any items to your cart yet.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brightColor hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brightColor"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 sm:p-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg transition-transform hover:scale-[1.02] bg-white"
                    >
                      <div className="aspect-[4/3] overflow-hidden rounded-xl">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.itemName}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            console.log("Image failed to load:", item.image);
                            e.target.onerror = null; // Prevent infinite loop of error
                            e.target.src = "/assets/placeholder.jpg";
                          }}
                          loading="lazy"
                        />
                      </div>

                      <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
                        <h3 className="font-semibold text-center text-lg sm:text-xl truncate">
                          {item.itemName}
                        </h3>

                        <div className="flex flex-row justify-center">
                          <BsStarFill className="text-brightColor text-sm sm:text-base" />
                          <BsStarFill className="text-brightColor text-sm sm:text-base" />
                          <BsStarFill className="text-brightColor text-sm sm:text-base" />
                          <BsStarFill className="text-brightColor text-sm sm:text-base" />
                          <BsStarHalf className="text-brightColor text-sm sm:text-base" />
                        </div>

                        <h3 className="font-semibold text-center text-base sm:text-lg">
                          LKR {item.price.toFixed(2)}
                        </h3>

                        <div className="flex justify-center items-center gap-2 mt-2">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-center font-medium text-brightColor pt-1">
                          Subtotal: LKR{" "}
                          {(item.price * item.quantity).toFixed(2)}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 ml-5"
                            aria-label="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="text-gray-900 font-medium">
                        LKR {subtotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Delivery Fee</p>
                      <p className="text-gray-900 font-medium">
                        LKR {deliveryFee.toFixed(2)}
                      </p>
                    </div>
                    <div className="border-t pt-4 flex justify-between">
                      <p className="text-gray-900 font-bold">Total</p>
                      <p className="text-brightColor font-bold">
                        LKR {total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="mt-6 w-full bg-brightColor text-white py-3 px-4 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brightColor transition-colors"
                    onClick={handleConfirmOrder}
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaCheckCircle className="h-6 w-6 text-brightColor" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Confirm Your Order
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to confirm this order? A total of
                        LKR {total.toFixed(2)} will be charged. (Cash on
                        Delivery)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brightColor text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brightColor sm:ml-3 sm:w-auto sm:text-sm ${
                    processing ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick={submitOrder}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="animate-spin mr-2">&#8987;</span>{" "}
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brightColor sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={processing}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
