import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { FaArrowLeft, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const OrderDetail = () => {
  const params = useParams();
  const { orderId } = params;
  console.log("Route params:", params);
  console.log("OrderId from params:", orderId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    async function getOrder() {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get order document
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        
        if (!orderSnap.exists()) {
          setError("Order not found");
          setLoading(false);
          return;
        }
        
        const orderData = { id: orderSnap.id, ...orderSnap.data() };
        
        // Ensure order belongs to current user
        if (orderData.userId !== currentUser.uid) {
          setError("You don't have permission to view this order");
          setLoading(false);
          return;
        }
        
        setOrder(orderData);
        
        // Fetch complete item details for each order item
        if (orderData.items && orderData.items.length > 0) {
          // Create a copy of items with complete details
          const itemsWithDetails = await Promise.all(
            orderData.items.map(async (item) => {
              try {
                // Get the menu item document for each order item
                const itemRef = doc(db, "menuItems", item.itemId);
                const itemSnap = await getDoc(itemRef);
                
                if (itemSnap.exists()) {
                  // Return combined data from order item and menu item
                  return {
                    ...item,
                    name: itemSnap.data().name,
                    image: itemSnap.data().img || itemSnap.data().image
                  };
                } else {
                  // If menu item no longer exists, use data from order
                  return {
                    ...item,
                    name: item.name || "Item no longer available"
                  };
                }
              } catch (err) {
                console.error("Error fetching item details:", err);
                return {
                  ...item,
                  name: item.name || "Item details unavailable"
                };
              }
            })
          );
          
          setOrderItems(itemsWithDetails);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
        setLoading(false);
      }
    }

    getOrder();
  }, [orderId, currentUser, navigate]);

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 pt-16">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brightColor"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">{error}</p>
              <button
                onClick={() => navigate("/orders")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brightColor hover:bg-orange-500"
              >
                <FaArrowLeft className="mr-2" /> Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">Order not found</p>
              <button
                onClick={() => navigate("/orders")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brightColor hover:bg-orange-500"
              >
                <FaArrowLeft className="mr-2" /> Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center text-gray-600 hover:text-brightColor"
          >
            <FaArrowLeft className="mr-2" /> Back to orders
          </button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-6 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Order #{order.id.slice(-6).toUpperCase()}
                </h1>
                <p className="text-gray-500 mt-1">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                  ${
                    order.status === "Completed" ||
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.status || "Processing"}
                </span>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {orderItems.length > 0 ? (
                  orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mb-3 sm:mb-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="sm:ml-4 flex-grow">
                        <h3 className="text-lg font-medium text-gray-800">
                          {item.name}
                        </h3>
                        {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                        {item.options && item.options.length > 0 && (
                          <p className="text-sm text-gray-500">
                            {item.options.join(", ")}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-3 sm:mt-0 flex flex-col items-end">
                        <p className="text-md font-medium text-gray-900">
                          ${item.price?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 py-4">No items in this order</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Delivery Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  {order.deliveryAddress ? (
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2" />
                        <p className="text-gray-800">
                          {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                          {order.deliveryAddress.state} {order.deliveryAddress.zip}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <FaPhone className="text-gray-500 mr-2" />
                        <p className="text-gray-800">
                          {order.deliveryAddress.phone || order.phone || "No phone provided"}
                        </p>
                      </div>
                      
                      {order.deliveryNotes && (
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-500 font-medium">
                            Delivery Notes:
                          </p>
                          <p className="text-gray-800">{order.deliveryNotes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No delivery information available</p>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="text-gray-800 font-medium">
                        ${order.subtotal?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    
                    {order.tax !== undefined && (
                      <div className="flex justify-between">
                        <p className="text-gray-600">Tax</p>
                        <p className="text-gray-800 font-medium">
                          ${order.tax.toFixed(2)}
                        </p>
                      </div>
                    )}
                    
                    {order.deliveryFee !== undefined && (
                      <div className="flex justify-between">
                        <p className="text-gray-600">Delivery Fee</p>
                        <p className="text-gray-800 font-medium">
                          ${order.deliveryFee.toFixed(2)}
                        </p>
                      </div>
                    )}
                    
                    {order.discount !== undefined && order.discount > 0 && (
                      <div className="flex justify-between">
                        <p className="text-green-600">Discount</p>
                        <p className="text-green-600 font-medium">
                          -${order.discount.toFixed(2)}
                        </p>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <p className="text-gray-800 font-semibold">Total</p>
                        <p className="text-gray-800 font-bold text-lg">
                          ${order.totalAmount?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <p className="text-gray-600">Payment Method</p>
                      <p className="text-gray-800 font-medium">
                        {order.paymentMethod || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetail;