import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Footer from "./components/Footer";
import Dishes from "./components/Dishes";
import Review from "./components/Review";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import OrderDetail from "./components/OrderDetail";  // Consider renaming this to avoid confusion
import AddToCart from "./components/AddToCart";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Desserts from "./components/Desserts";
import FreshJuice from "./components/FreshJuice";
import Shakes from "./components/Shakes";
import { useAuth } from "./contexts/AuthContext";
import { motion } from "framer-motion";
import { FaLock, FaInfoCircle } from "react-icons/fa";
import OrderList from "./components/OrderList";
import PrflOrdrDetails from "./components/PrflOrdrDetails";

// Login Notification Component
const LoginNotification = () => {
  const { currentUser } = useAuth();

  // Don't show the notification for logged-in users
  if (currentUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-amber-50 border-l-4 border-brightColor px-4 py-3 mb-8 mx-auto max-w-4xl rounded shadow-sm"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <FaInfoCircle className="h-5 w-5 text-brightColor" />
        </div>
        <div className="ml-3">
          <p className="text-lg text-amber-800">
            <FaLock className="inline-block mr-1 text-base" />
            Please{" "}
            <Link
              to="/login"
              className="font-medium underline text-brightColor hover:text-orange-600"
            >
              login
            </Link>{" "}
            to order items from our menu.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main className="flex flex-col w-full overflow-x-hidden">
        <section id="home">
          <Home />
        </section>

        {/* Login Notification Banner */}
        <div className="bg-white py-10">
          <LoginNotification />
        </div>

        <section id="dishes">
          <Dishes />
        </section>

        <section id="freshjuice">
          <FreshJuice />
        </section>

        <section id="shakes">
          <Shakes />
        </section>

        <section id="desserts">
          <Desserts />
        </section>

        <section id="about">
          <About />
        </section>

        <section id="review">
          <Review />
        </section>
      </main>

      <Footer />
    </>
  );
};

// Protected Route Component
const ProtectedRouteWrapper = ({ children, showNavbar = false }) => {
  return (
    <ProtectedRoute>
      <>
        {showNavbar && <Navbar />}
        <main>{children}</main>
        <Footer />
      </>
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRouteWrapper>
                <Profile />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRouteWrapper>
                <OrderList />
              </ProtectedRouteWrapper>
            }
          />
          {/* REMOVE or COMMENT OUT this first definition of /order/:orderId */}
          {/* 
          <Route
            path="/order/:orderId"
            element={
              <ProtectedRouteWrapper>
                <OrderDetail />
              </ProtectedRouteWrapper>
            }
          />
          */}
          <Route
            path="/cart"
            element={
              <ProtectedRouteWrapper showNavbar={false}>
                <AddToCart />
              </ProtectedRouteWrapper>
            }
          />
          {/* Keep only this one route for viewing orders */}
          <Route 
            path="/order/:orderId" 
            element={
              <ProtectedRouteWrapper>
                <PrflOrdrDetails />
              </ProtectedRouteWrapper>
            } 
          />
        </Routes>
        {/* Add ToastContainer here so it's accessible throughout the app */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
};

export default App;