import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";

const Profile = () => {
  const {
    currentUser,
    userProfile,
    updateUserProfile,
    updateUserDetails,
    fetchUserProfile,
  } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    address: "",
  });

  // Load user profile and orders
  useEffect(() => {
    async function loadUserData() {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        console.log("Current userProfile:", userProfile);

        // Explicitly fetch profile data if userProfile is null
        let profileData = userProfile;
        if (!profileData) {
          console.log("Fetching profile data explicitly");
          // Call fetchUserProfile from the destructured value at the top level
          profileData = await fetchUserProfile();
          console.log("Fetched profile data:", profileData);
        }

        // Set initial form data from userProfile
        if (profileData) {
          console.log("Phone from userProfile:", profileData.phone);
          console.log("Address from userProfile:", profileData.address);

          setFormData({
            displayName: currentUser.displayName || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
          });
        }

        // Fetch user orders
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersList);
        setLoading(false);
      } catch (err) {
        console.error("Error loading profile data:", err);
        setError("Failed to load your profile data");
        setLoading(false);
      }
    }

    loadUserData();
  }, [currentUser, navigate, userProfile, fetchUserProfile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      // Update display name in Firebase Auth if changed
      if (formData.displayName !== currentUser.displayName) {
        await updateUserProfile(formData.displayName);
      }

      // Update additional details in Firestore
      await updateUserDetails({
        phone: formData.phone,
        address: formData.address,
      });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading && !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 pt-16">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brightColor"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account details and view your orders
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Personal Information
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-sm text-brightColor hover:text-orange-500"
                  >
                    {isEditing ? (
                      "Cancel"
                    ) : (
                      <>
                        <FaEdit className="mr-1" /> Edit
                      </>
                    )}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="displayName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" size={16} />
                          </div>
                          <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brightColor focus:ring-brightColor sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" size={16} />
                          </div>
                          <input
                            type="email"
                            id="email"
                            value={currentUser?.email || ""}
                            disabled
                            className="pl-10 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500 shadow-sm sm:text-sm cursor-not-allowed"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Email cannot be changed
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone className="text-gray-400" size={16} />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brightColor focus:ring-brightColor sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Delivery Address
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                            <FaMapMarkerAlt
                              className="text-gray-400"
                              size={16}
                            />
                          </div>
                          <textarea
                            id="address"
                            name="address"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brightColor focus:ring-brightColor sm:text-sm"
                          ></textarea>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brightColor hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brightColor"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2" /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaUser className="text-gray-500 mr-3" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-medium">
                          {currentUser?.displayName || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-500 mr-3" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{currentUser?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FaPhone className="text-gray-500 mr-3" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium">
                          {userProfile?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaMapMarkerAlt
                        className="text-gray-500 mr-3 mt-1"
                        size={16}
                      />
                      <div>
                        <p className="text-xs text-gray-500">
                          Delivery Address
                        </p>
                        <p className="font-medium">
                          {userProfile?.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Order History Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Order History
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
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
                    <p className="mt-2 text-gray-500">
                      You haven't placed any orders yet
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brightColor hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brightColor"
                    >
                      Browse Menu
                    </button>
                    {/* The sample order button has been removed from here */}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Order ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">View</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                #{order.id.slice(-6).toUpperCase()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(order.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                ${order.totalAmount?.toFixed(2) || "0.00"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
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
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => navigate(`/order/${order.id}`)}
                                className="text-brightColor hover:text-orange-500"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
