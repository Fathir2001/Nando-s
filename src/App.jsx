import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Dishes from "./components/Dishes";
import Review from "./components/Review";
import Login from "./components/Login";

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

        <div id="about">
          <About />
        </div>

        <div id="menu">
          <Menu />
        </div>

        <div id="review">
          <Review />
        </div>
      </main>

      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;