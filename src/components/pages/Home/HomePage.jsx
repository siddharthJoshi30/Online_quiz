import React from "react";
import "./homepage.css";

const HomePage = () => {
  return (
    <div className="homedemo-container">
      <div className="background-image"></div>
      <div className="content">
        <h1 className="title">Welcome to the Quiz App!</h1>
        <p className="description">MERN Stack Project - ETHNUS</p>
        <button className="start-button">Get Started</button>
      </div>
    </div>
  );
};

export default HomePage;
