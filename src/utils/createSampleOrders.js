import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export const createSampleOrders = async (userId) => {
  try {
    // Sample menu items
    const menuItems = [
      { id: 1, name: "Peri-Peri Chicken - 1/4", price: 8.99 },
      { id: 2, name: "Peri-Peri Chicken - 1/2", price: 12.99 },
      { id: 3, name: "Chicken Wings (6 pcs)", price: 9.49 },
      { id: 4, name: "Chicken Wrap", price: 7.99 },
      { id: 5, name: "Grilled Halloumi Salad", price: 10.99 },
      { id: 6, name: "Garlic Bread", price: 3.99 },
      { id: 7, name: "Spicy Rice", price: 2.99 },
      { id: 8, name: "Peri Chips", price: 3.49 },
      { id: 9, name: "Bottomless Soft Drink", price: 3.20 },
    ];
    
    // Sample statuses
    const statuses = ["Pending", "Processing", "Completed", "Delivered", "Cancelled"];
    
    // Sample payment methods
    const paymentMethods = ["Credit Card", "PayPal", "Cash on Delivery"];
    
    // Create 5 sample orders
    for (let i = 0; i < 5; i++) {
      // Random number of items (1-4)
      const numItems = Math.floor(Math.random() * 4) + 1;
      const orderItems = [];
      let subtotal = 0;
      
      // Add random items to order
      for (let j = 0; j < numItems; j++) {
        const item = menuItems[Math.floor(Math.random() * menuItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = item.price * quantity;
        
        orderItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
        });
        
        subtotal += itemTotal;
      }
      
      // Random delivery fee (2-5)
      const deliveryFee = Math.floor(Math.random() * 3) + 2;
      
      // Random discount (0-10% of subtotal)
      const discountPercent = Math.floor(Math.random() * 11);
      const discount = (subtotal * discountPercent) / 100;
      
      // Calculate total
      const totalAmount = subtotal + deliveryFee - discount;
      
      // Create order with random status and dates
      const daysAgo = i * 2; // Each order is 2 days apart
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - daysAgo);
      
      // Random status
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Random payment method
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Payment status (if Cancelled, always Pending, otherwise 80% chance of Paid)
      const paymentStatus = status === "Cancelled" 
        ? "Pending" 
        : (Math.random() < 0.8 ? "Paid" : "Pending");
      
      // Create the order
      await addDoc(collection(db, "orders"), {
        userId,
        items: orderItems,
        subtotal,
        deliveryFee,
        discount,
        totalAmount,
        status,
        paymentMethod,
        paymentStatus,
        deliveryAddress: "123 Main Street, Apt 4B, Cityville",
        contactNumber: "555-123-4567",
        deliveryNotes: i % 2 === 0 ? "Please leave at door" : "",
        estimatedDeliveryTime: `${15 + Math.floor(Math.random() * 30)} minutes`,
        createdAt: orderDate,
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error creating sample orders:", error);
    return { success: false, error };
  }
};