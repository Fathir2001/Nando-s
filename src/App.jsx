import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
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
import OrderDetail from "./components/OrderDetail";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Desserts from "./components/Desserts";
import FreshJuice from "./components/FreshJuice";
import Shakes from "./components/Shakes";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main className="flex flex-col w-full overflow-x-hidden">
        <section id="home">
          <Home />
        </section>

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
const ProtectedRouteWrapper = ({ children }) => {
  return (
    <ProtectedRoute>
      <>
        <Navbar />
        <main className="pt-20">{children}</main>
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