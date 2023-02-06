import { useState, useEffect } from "react";
import Weather from "./Weather";
import cities from "./cities.json";
import HomePage from "./HomePage";
import logo from "./assets/weatherIcon.svg";
/* import "./index.scss" */
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import City from "./City";

function App() {
  return (
    <>
      <div className="title">
        <div>
          <img src={logo} alt="icon" />
        </div>
        <div>
          <h2>Weather App</h2>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:cityCode" element={<City />} />
      </Routes>
      <div className="footer">
        <p>💚 Coded with passion 💚</p>
      </div>
    </>
  );
}

export default App;
