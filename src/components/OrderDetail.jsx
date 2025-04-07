import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const OrderDetail = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOrder = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        
        if (!orderSnap.exists()) {
          setError("Order not found");
          setLoading(false);
          return;
        }
        
        const orderData = orderSnap.data();
        
        // Security check - ensure user only sees their own orders
        if (orderData.userId !== currentUser.uid) {
          setError("You don't have permission to view this order");
          setLoading(false);
          return;
        }
        
        setOrder({ id: orderSnap.id, ...orderData });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
        setLoading(false);
      }
    };

    getOrder();
  }, [orderId, currentUser, navigate]);

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 pt-16 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-gray-900">{error}</h3>
          <div className="mt-4">
            <button
              onClick={() => navigate("/profile")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brightColor hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brightColor"
            >
              Go Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="inline-flex items-center text-gray-600 hover:text-brightColor"
          >
            <FaArrowLeft className="mr-2" /> Back to Profile
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-900">
                  Order #{order.id.slice(-6).toUpperCase()}
                </h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="px-6 py-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="2" className="px-4 py-2 text-sm font-medium text-gray-500 text-right">
                        Subtotal
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        ${order.subtotal?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                    {order.discount > 0 && (
                      <tr>
                        <td colSpan="2" className="px-4 py-2 text-sm font-medium text-gray-500 text-right">
                          Discount
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                          -${order.discount?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="2" className="px-4 py-2 text-sm font-medium text-gray-500 text-right">
                        Delivery Fee
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        ${order.deliveryFee?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                        Total
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-brightColor text-right">
                        ${order.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Delivery Information</h2>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.deliveryAddress || "Not provided"}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Contact</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.contactNumber || "Not provided"}</dd>
                  </div>
                  {order.deliveryNotes && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Delivery Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900">{order.deliveryNotes}</dd>
                    </div>
                  )}
                  {order.estimatedDeliveryTime && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Estimated Delivery</dt>
                      <dd className="mt-1 text-sm text-gray-900">{order.estimatedDeliveryTime}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Payment Information</h2>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.paymentMethod || "Not specified"}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                    <dd className="mt-1 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus || "Pending"}
                        {order.paymentStatus === 'Paid' && <FaCheck className="ml-1" />}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brightColor hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brightColor"
            >
              Order Again
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetail;