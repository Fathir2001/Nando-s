import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { FaArrowLeft } from "react-icons/fa";

const OrderDetail = () => {
  const params = useParams();
  const orderId = params.orderId;
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getOrder() {
      try {
        setLoading(true);
        if (!orderId) {
          setError("Order ID is missing");
          setLoading(false);
          return;
        }

        // Fetch the order document directly
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          setError("Order not found");
          setLoading(false);
          return;
        }

        // Get the order data with its ID
        const orderData = { id: orderSnap.id, ...orderSnap.data() };
        
        // Only try to fetch item details if the order has items
        if (orderData.items && Array.isArray(orderData.items)) {
          // No need to fetch additional details if items are already complete
          setOrder(orderData);
        } else {
          setOrder(orderData);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }

    getOrder();
  }, [orderId]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brightColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-red-500 text-xl mb-4">Error: {error}</div>
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 bg-brightColor hover:bg-orange-500 text-white rounded-md"
            >
              <FaArrowLeft className="mr-2" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-gray-500 text-xl mb-4">Order not found</div>
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 bg-brightColor hover:bg-orange-500 text-white rounded-md"
            >
              <FaArrowLeft className="mr-2" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center mb-6 text-brightColor hover:text-orange-500"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</h1>
            <p className="text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
            
            <div className="mt-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.status === "Completed" || order.status === "Delivered" 
                  ? "bg-green-100 text-green-800"
                  : order.status === "Cancelled" 
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}>
                {order.status || "Processing"}
              </span>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            
            <div className="space-y-4">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center">
                    {item.img && (
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                    )}
                    <div>
                      <h3 className="text-gray-900 font-medium">{item.name}</h3>
                      {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                      {item.extras && item.extras.length > 0 && (
                        <p className="text-sm text-gray-500">
                          Extras: {item.extras.join(", ")}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        ${parseFloat(item.price).toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-gray-500">Subtotal</p>
                <p className="text-gray-900">
                  ${
                    order.items
                      ? order.items
                          .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                          .toFixed(2)
                      : "0.00"
                  }
                </p>
              </div>
              
              {order.deliveryFee !== undefined && (
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Delivery</p>
                  <p className="text-gray-900">${order.deliveryFee.toFixed(2)}</p>
                </div>
              )}
              
              {order.tax !== undefined && (
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Tax</p>
                  <p className="text-gray-900">${order.tax.toFixed(2)}</p>
                </div>
              )}
              
              <div className="flex justify-between text-base font-medium pt-2 border-t">
                <p className="text-gray-900">Total</p>
                <p className="text-gray-900">${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1">{order.customerName || "Not provided"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="mt-1">{order.customerPhone || "Not provided"}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                <p className="mt-1">{order.deliveryAddress || "Not provided"}</p>
              </div>
              
              {order.deliveryInstructions && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Delivery Instructions</p>
                  <p className="mt-1">{order.deliveryInstructions}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="mt-1">{order.paymentMethod || "Cash On Delivery"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Status</p>
                <p className="mt-1">{order.paymentStatus === "paid" ? "Paid" : "Pending"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;