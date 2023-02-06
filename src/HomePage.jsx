import React from "react";
import { useState, useEffect } from "react";
import Weather from "./Weather";
import cities from "./cities.json";
import logo from "./assets/weatherIcon.svg";
import "./App.scss";
import { Route, Routes } from "react-router-dom";

const HomePage = () => {
  const [cityCodes, setCityCodes] = useState([]);
  const API_KEY = "bb28004717ff69635c9fd329b739e04c";
  const units = "metric";

  useEffect(() => {
    const codes = cities.List.map((city) => city.CityCode);
    setCityCodes(codes);
  }, []);
  return (
    <>
      <div className="parent">
        {cityCodes.map((cityCode, index) => (
          <Weather
            index={index}
            key={cityCode}
            cityCode={cityCode}
            units={units}
            api={API_KEY}
          />
        ))}
      </div>
    </>
  );
};

export default HomePage;

/* useEffect(() => {
    fetch("./data/cities.json")
      .then((response) => response.json())
      .then((cities) => {
        const codes = cities.List.map((city) => city.code);
        setCityCodes(codes);
      });
  }, []); */

/* <Routes>
        <Route path="">
      </Routes> */
