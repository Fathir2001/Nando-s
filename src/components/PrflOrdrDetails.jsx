import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  FaArrowLeft,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const PrflOrdrDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true);
        console.log("Fetching order details for ID:", orderId);
        console.log("Current userProfile from context:", userProfile);

        // Check if we have user profile data from context
        if (userProfile) {
          console.log("User profile from context:", {
            fullName: userProfile.fullName,
            displayName: userProfile.displayName,
            phone: userProfile.phone,
            address: userProfile.address,
          });
        }

        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          let orderData = { id: orderSnap.id, ...orderSnap.data() };
          console.log("Order data fetched:", orderData);

          // If this order belongs to the current user, use their profile data
          if (orderData.userId === currentUser?.uid) {
            console.log("Order belongs to current user, using userProfile");
            setUserData(userProfile);
          }
          // Otherwise fetch the user data for this order
          else if (orderData.userId) {
            console.log("Fetching user data for:", orderData.userId);
            try {
              const userRef = doc(db, "users", orderData.userId);
              const userSnap = await getDoc(userRef);

              if (userSnap.exists()) {
                const userData = userSnap.data();
                console.log("User data fetched:", userData);
                setUserData(userData);
              }
            } catch (userErr) {
              console.error("Error fetching user data:", userErr);
            }
          }

          setOrder(orderData);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, userProfile, currentUser]);

  useEffect(() => {
    if (order && order.items && order.items.length > 0) {
      console.log("Item structure check:", {
        firstItem: order.items[0],
        hasNameProperty: "name" in order.items[0],
        itemKeys: Object.keys(order.items[0]),
        possibleNameFields: {
          name: order.items[0].name,
          title: order.items[0].title,
          productName: order.items[0].productName,
          itemName: order.items[0].itemName,
        },
      });
    }
  }, [order]);

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status color for styling
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
      case "Preparing":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get user data (either from order, fetched user data, or current user profile)
  const getCustomerName = () => {
    console.log("Getting customer name:", {
      order: order?.customerName,
      userData: userData
        ? {
            fullName: userData.fullName,
            displayName: userData.displayName,
            name: userData.name,
          }
        : null,
      userProfile: userProfile
        ? {
            fullName: userProfile.fullName,
            displayName: userProfile.displayName,
          }
        : null,
    });

    // Order data takes priority
    if (order?.customerName) return order.customerName;

    // Then check userData (user who placed the order)
    if (userData) {
      const name = userData.fullName || userData.displayName || userData.name;
      if (name) return name;
    }

    // Then check current user profile
    if (userProfile) {
      const name =
        userProfile.fullName || userProfile.displayName || userProfile.name;
      if (name) return name;
    }

    return "Not provided";
  };

  const getCustomerPhone = () => {
    console.log("Getting customer phone:", {
      orderPhone: order?.customerPhone,
      userData: userData ? { phone: userData.phone } : null,
      userProfile: userProfile ? { phone: userProfile.phone } : null,
    });

    if (order?.customerPhone) return order.customerPhone;

    if (userData) {
      const phone = userData.phone || userData.phoneNumber;
      if (phone) return phone;
    }

    if (userProfile) {
      const phone = userProfile.phone || userProfile.phoneNumber;
      if (phone) return phone;
    }

    return "Not provided";
  };

  const getDeliveryAddress = () => {
    console.log("Getting delivery address:", {
      orderAddress: order?.deliveryAddress,
      userData: userData ? { address: userData.address } : null,
      userProfile: userProfile ? { address: userProfile.address } : null,
    });

    if (order?.deliveryAddress) return order.deliveryAddress;

    if (userData) {
      const address =
        userData.address || userData.deliveryAddress || userData.location;
      if (address) return address;
    }

    if (userProfile) {
      const address =
        userProfile.address ||
        userProfile.deliveryAddress ||
        userProfile.location;
      if (address) return address;
    }

    return "Not provided";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-8 pb-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brightColor"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-red-500 text-xl mb-4">Error: {error}</div>
            <button
              onClick={() => navigate("/profile")}
              className="inline-flex items-center px-4 py-2 bg-brightColor hover:bg-orange-500 text-white rounded-md"
            >
              <FaArrowLeft className="mr-2" /> Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-gray-500 text-xl mb-4">Order not found</div>
            <button
              onClick={() => navigate("/profile")}
              className="inline-flex items-center px-4 py-2 bg-brightColor hover:bg-orange-500 text-white rounded-md"
            >
              <FaArrowLeft className="mr-2" /> Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate("/profile")}
            className="inline-flex items-center mb-6 text-brightColor hover:text-orange-500"
          >
            <FaArrowLeft className="mr-2" /> Back to Profile
          </button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </h1>
                  <div className="flex items-center mt-2">
                    <FaClock className="text-gray-400 mr-2" />
                    <span className="text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status || "Processing"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items &&
                      order.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              {item.img && (
                                <div className="flex-shrink-0 h-10 w-10 mr-3">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={item.img}
                                    alt={item.name || "Food item"}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.name ||
                                    item.title ||
                                    item.productName ||
                                    item.itemName ||
                                    (item.product &&
                                      (item.product.name ||
                                        item.product.title)) ||
                                    JSON.stringify(item).substring(0, 20) +
                                      "..." ||
                                    "Unnamed item"}
                                </div>
                                {item.size && (
                                  <div className="text-xs text-gray-500">
                                    Size: {item.size}
                                  </div>
                                )}
                                {item.extras && item.extras.length > 0 && (
                                  <div className="text-xs text-gray-500">
                                    Extras: {item.extras.join(", ")}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    {order.deliveryFee && (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-sm font-medium text-gray-900 text-right"
                        >
                          Delivery Fee
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          ${order.deliveryFee.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {order.tax && (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-sm font-medium text-gray-900 text-right"
                        >
                          Tax
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          ${order.tax.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-base font-bold text-gray-900 text-right"
                      >
                        Total
                      </td>
                      <td className="px-4 py-3 text-base font-bold text-gray-900 text-right">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start mb-3">
                    <FaUser className="text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Customer Name</p>
                      <p className="font-medium text-gray-900">
                        {getCustomerName()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start mb-3">
                    <FaPhone className="text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">
                        {getCustomerPhone()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start mb-3">
                    <FaMapMarkerAlt className="text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Delivery Address</p>
                      <p className="font-medium text-gray-900">
                        {getDeliveryAddress()}
                      </p>
                    </div>
                  </div>

                  {order.deliveryInstructions && (
                    <div className="flex items-start">
                      <div className="text-gray-400 mr-3">📝</div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Delivery Instructions
                        </p>
                        <p className="font-medium text-gray-900">
                          {order.deliveryInstructions}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">
                    {order.paymentMethod || "Cash On Delivery"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Payment Status</p>
                  <p className="font-medium text-gray-900">
                    {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrflOrdrDetails;
