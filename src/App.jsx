import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Dishes from "./components/Dishes";
import Review from "./components/Review";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import OrderDetail from "./components/OrderDetail";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import Desserts from "./components/Desserts";
import FreshJuice from "./components/FreshJuice";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <div id="home">
          <Home />
        </div>

        <div id="dishes">
          <Dishes />
        </div>

        <div id="freshjuice">
          <FreshJuice />
        </div>

        <div id="desserts">
          <Desserts />
        </div>

        <div id="about">
          <About />
        </div>

        {/* <div id="menu">
          <Menu />
        </div> */}

        <div id="review">
          <Review />
        </div>
      </main>

      <Footer />
    </>
  );
};

// Protected Route Component
const ProtectedRouteWrapper = ({ children }) => {
  return (
    <ProtectedRoute>
      <>
        <Navbar />
        {children}
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
            path="/order/:orderId"
            element={
              <ProtectedRouteWrapper>
                <OrderDetail />
              </ProtectedRouteWrapper>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
